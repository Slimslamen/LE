import Footer from "../../components/Footer";
import SecondHeader from "../../components/SeconHeader";

const policy = () => {
  return (
    <div className="min-h-screen">
      <link rel="canonical" href="https://lavinelektriska.se/policy" />
      <SecondHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#66BEF0] to-[#4A90E2] py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Sekretesspolicy</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Läs om hur vi behandlar och skyddar dina personuppgifter hos Lavin Elektriska.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            {/* Privacy Policy */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Sekretesspolicy</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Insamling av Personuppgifter</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Vi samlar in personuppgifter när du kontaktar oss för våra tjänster, begär offerter eller använder
                    vår webbplats. De uppgifter vi samlar in kan inkludera:
                  </p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Namn och kontaktuppgifter (telefonnummer, e-postadress)</li>
                    <li>Adress för tjänsteutförande</li>
                    <li>Information om elektriska behov och projekt</li>
                    <li>Faktureringsuppgifter</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Användning av Personuppgifter</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">Vi använder dina personuppgifter för att:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Tillhandahålla våra elektriska tjänster</li>
                    <li>Kommunicera med dig angående ditt projekt</li>
                    <li>Skicka offerter och fakturor</li>
                    <li>Förbättra våra tjänster</li>
                    <li>Uppfylla juridiska förpliktelser</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Delning av Uppgifter</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vi delar inte dina personuppgifter med tredje part utan ditt samtycke, förutom när det krävs enligt
                    lag eller för att utföra våra tjänster (t.ex. leverantörer av specialutrustning).
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Säkerhet</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter mot
                    obehörig åtkomst, förlust eller missbruk.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Dina Rättigheter</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">Enligt GDPR har du rätt att:</p>
                  <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Begära tillgång till dina personuppgifter</li>
                    <li>Rätta felaktiga uppgifter</li>
                    <li>Radera dina uppgifter under vissa omständigheter</li>
                    <li>Begränsa behandlingen av dina uppgifter</li>
                    <li>Invända mot behandlingen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">6. Kontakt</h3>
                  <p className="text-gray-700 leading-relaxed">
                    För frågor om denna sekretesspolicy eller dina personuppgifter, kontakta oss på:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <p className="text-gray-700">
                      <strong>E-post:</strong> Le@lavinelektriska.se
                    </p>
                    <p className="text-gray-700">
                      <strong>Telefon:</strong> +46729110256
                    </p>
                    {/* <p className="text-gray-700"><strong>Adress:</strong> Olskrokstorget, 41665 Göteborg</p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Allmänna Villkor</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Tjänster</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Lavin Elektriska tillhandahåller professionella elektriska tjänster för bostäder och kommersiella
                    fastigheter. Alla tjänster utförs enligt gällande säkerhetsföreskrifter och branschstandarder.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Priser och Betalning</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Priser anges i svenska kronor och inkluderar moms där det är tillämpligt. Betalning ska ske enligt
                    överenskomna villkor, vanligtvis inom 30 dagar från fakturadatum.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Garanti</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vi garanterar vårt arbete enligt branschstandarder. Garantin täcker fel i utförandet men inte normal
                    förslitning eller skador orsakade av missbruk.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">4. Ansvar</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vårt ansvar begränsas till direkta skador som uppstår på grund av vårt försummelse. Vi har
                    erforderlig försäkring för våra tjänster.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">5. Ändringar</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vi förbehåller oss rätten att ändra dessa villkor. Ändringar träder i kraft när de publiceras på vår
                    webbplats.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#66BEF0]/10 rounded-lg">
              <p className="text-sm text-gray-600 text-center">Senast uppdaterad: 29 juni 2025</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default policy;
