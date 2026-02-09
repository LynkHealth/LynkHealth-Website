import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertContactInquirySchema, insertNightCoverageInquirySchema, insertWoundCareReferralSchema } from "@shared/schema";
import { z } from "zod";
// @ts-ignore - No type definitions available for this package
import mailchimp from "@mailchimp/mailchimp_marketing";
import { registerAdminRoutes, seedAdminUsers, adminAuth } from "./admin-routes";

// Stricter rate limit for form submissions - 5 per 15 minutes per IP
const formRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many form submissions. Please try again later." },
});

// Initialize Mailchimp
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

async function addToMailchimp(email: string, firstName: string, lastName: string, organizationType: string) {
  try {
    const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_AUDIENCE_ID!, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        ORGTYPE: organizationType
      },
      tags: ["Website Contact Form"]
    });
    console.log("Successfully added to Mailchimp:", email);
    return response;
  } catch (error: any) {
    // If user already exists, try to update their info
    if (error.response?.body?.title === "Member Exists") {
      try {
        const updateResponse = await mailchimp.lists.updateListMember(
          process.env.MAILCHIMP_AUDIENCE_ID!,
          email,
          {
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
              ORGTYPE: organizationType
            },
            tags: ["Website Contact Form"]
          }
        );
        console.log("Updated existing Mailchimp subscriber:", email);
        return updateResponse;
      } catch (updateError) {
        console.error("Error updating Mailchimp subscriber:", updateError);
        // Don't throw here - we still want the contact form to work
      }
    } else {
      console.error("Error adding to Mailchimp:", error.response?.body || error.message);
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contact", formRateLimit, async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      
      // Store in database
      const inquiry = await storage.createContactInquiry(validatedData);
      
      // Add to Mailchimp (don't let this fail the whole request)
      try {
        await addToMailchimp(
          validatedData.email,
          validatedData.firstName,
          validatedData.lastName,
          validatedData.organizationType
        );
      } catch (mailchimpError) {
        console.error("Mailchimp integration failed, but contact form succeeded:", mailchimpError);
      }
      
      res.json({ 
        success: true, 
        message: "Thank you for your inquiry! We will contact you within 24 hours.",
        id: inquiry.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your form data and try again.",
          errors: error.errors 
        });
      } else {
        console.error("Contact form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "We're experiencing technical difficulties. Please try again later or call us directly." 
        });
      }
    }
  });

  // Night coverage inquiry submission endpoint
  app.post("/api/contact-night-coverage", formRateLimit, async (req, res) => {
    try {
      const validatedData = insertNightCoverageInquirySchema.parse(req.body);
      
      // Store in database
      const inquiry = await storage.createNightCoverageInquiry(validatedData);
      
      res.json({ 
        success: true, 
        message: "Thank you for your night coverage inquiry! We will contact you within 1 business day.",
        id: inquiry.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your form data and try again.",
          errors: error.errors 
        });
      } else {
        console.error("Night coverage form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "We're experiencing technical difficulties. Please try again later or contact us directly at hello@lynk.health" 
        });
      }
    }
  });

  // Wound care referral submission endpoint
  app.post("/api/referrals/wound-care", formRateLimit, async (req, res) => {
    try {
      const validatedData = insertWoundCareReferralSchema.parse(req.body);
      
      // Store in database
      const referral = await storage.createWoundCareReferral(validatedData);
      
      res.json({ 
        success: true, 
        message: "Thank you for your referral! We will contact you within 1 business day to coordinate the patient's wound care pathway.",
        id: referral.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Please check your form data and try again.",
          errors: error.errors 
        });
      } else {
        console.error("Wound care referral form error:", error);
        res.status(500).json({ 
          success: false, 
          message: "We're experiencing technical difficulties. Please try again later or contact us directly at hello@lynk.health" 
        });
      }
    }
  });

  // Get contact inquiries (admin only - requires authentication)
  app.get("/api/contact-inquiries", adminAuth, async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error fetching inquiries" 
      });
    }
  });

  await registerAdminRoutes(app);
  await seedAdminUsers();

  const httpServer = createServer(app);
  return httpServer;
}
