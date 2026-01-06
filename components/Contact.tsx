"use client";

import { useForm, ValidationError } from "@formspree/react";

const Contact = ({ showContent }: { showContent: boolean }) => {
  const [state, handleSubmit] = useForm("xrbkjgpz");

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity,transform,margin-top] duration-700 ease-in-out
        ${
          showContent
            ? "max-h-[1200px] opacity-100 translate-y-0 mt-20"
            : "max-h-0 opacity-0 -translate-y-4 mt-0 pointer-events-none"
        }`}
      aria-hidden={!showContent}
    >
      {state.succeeded ? (
        <div className="py-10 bg-white rounded-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900">Vi återkopplar så snart som möjligt!</h2>
        </div>
      ) : (
        <section id="contact" className="py-20 bg-white rounded-lg" aria-label="Kontaktformulär">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Kontakta oss</h2>
            </div>

            <div className="grid lg:grid-cols-1 gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto" aria-label="Kontaktformulär">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Förnamn</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BEF0] focus:border-transparent"
                        placeholder="Förnamn"
                        name="firstname"
                      />
                    </div>
                    <input type="text" name="_spamRobot" style={{ display: "none" }} />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Efternamn</label>
                      <input
                        required
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BEF0] focus:border-transparent"
                        placeholder="Efternamn"
                        name="lastname"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BEF0] focus:border-transparent"
                        placeholder="le@lavinelektriska.com"
                        aria-required="true"
                        aria-label="E-postadress"
                      />
                      <ValidationError prefix="Email" field="email" errors={state.errors} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BEF0] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meddelande</label>
                    <textarea
                      required
                      rows={4}
                      maxLength={400}
                      name="message"
                      id="message"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#66BEF0] focus:border-transparent"
                      placeholder="Beskriv ditt önskemål..."
                      aria-required="true"
                      aria-label="Meddelande"
                    ></textarea>
                  </div>

                  <button
                    disabled={state.submitting}
                    type="submit"
                    className="w-full bg-[#66BEF0] text-white py-3 rounded-lg font-semibold hover:bg-[#5aa8d4] transition-colors"
                    aria-label="Skicka meddelande"
                  >
                    Skicka meddelande
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Contact;
