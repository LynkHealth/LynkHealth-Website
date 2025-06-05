import ContactForm from "@/components/forms/contact-form";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="py-20 bg-slate-50">
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Partner With Us</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Ready to enhance your patient care capabilities? Get in touch with our team to learn how we can help.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          <ContactForm />
          
          {/* Contact Information */}
          <div>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Headquarters</div>
                    <div className="text-slate-600">123 Healthcare Drive<br />Medical City, MC 12345</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Phone</div>
                    <div className="text-slate-600">(555) 123-LYNK</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4 mt-1">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Email</div>
                    <div className="text-slate-600">partners@lynkhealth.com</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Embedded Map Placeholder */}
            <div className="bg-slate-200 rounded-2xl h-64 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <i className="fas fa-map-marked-alt text-4xl mb-2"></i>
                <div>Interactive Map</div>
                <div className="text-sm">Google Maps Integration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
