"use client";

import Image from "next/image";
import { useSupabase } from "@/Context/supabaseContext";
import EditableText from "./AdminEdit/EditableText";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  text: string;
};

const Testimonials = () => {
  const { textsMap } = useSupabase();

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Henrik",
      location: "Rävlanda",
      rating: 5,
      text: "Fantastisk service! Lavin Elektriska installerade laddstolpe för vår Volvo och jobbet var perfekt utfört. Professionellt och punktligt.",
    },
    {
      id: 2,
      name: "Ted",
      location: "Mölndal",
      rating: 5,
      text: "Mycket nöjd med elinstallationen i vårt nya kök. Snabb respons på jouren och rimliga priser. Rekommenderar starkt!",
    },
    {
      id: 3,
      name: "Ivan",
      location: "Åkered",
      rating: 5,
      text: "Lavin Elektriska hjälpte oss med elinstallationerna i vårt hus. Arbetet utfördes professionellt och enligt tidplan. Vi ger dem toppbetyg!",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/Videos/Working.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-50 drop-shadow mb-4">
            <EditableText
              textKey="testimonials_heading"
              value={textsMap?.testimonials_heading}
              fallback="Vad våra kunder säger"
            />
          </h2>
          <p className="text-xl text-gray-100/90 drop-shadow max-w-2xl mx-auto">
            <EditableText
              textKey="testimonials_subheading"
              value={textsMap?.testimonials_subheading}
              fallback="Vi är stolta över vårt arbete och våra nöjda kunder är vårt bästa bevis på kvalitet."
            />
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center mb-6">
                <div>
                  <h4 className="font-bold text-gray-900">
                    <EditableText
                      textKey={`testimonials_item${testimonial.id}_name`}
                      value={textsMap?.[`testimonials_item${testimonial.id}_name`]}
                      fallback={testimonial.name}
                    />
                  </h4>
                  <p className="text-gray-600 text-sm">
                    <EditableText
                      textKey={`testimonials_item${testimonial.id}_location`}
                      value={textsMap?.[`testimonials_item${testimonial.id}_location`]}
                      fallback={testimonial.location}
                    />
                  </p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Image
                    key={i}
                    src="/svg/star-svgrepo-com.svg"
                    alt="check circle icon"
                    width={24}
                    height={24}
                    loading="lazy"
                    className="w-6 h-6"
                  />
                ))}
              </div>

              <div className="relative">
                <Image
                  src="/svg/quote-svgrepo-com.svg"
                  alt="check circle icon"
                  width={24}
                  height={24}
                  loading="lazy"
                  className="w-8 h-8"
                />
                <p className="text-gray-700 leading-relaxed pl-6">
                  <EditableText
                    textKey={`testimonials_item${testimonial.id}_text`}
                    value={textsMap?.[`testimonials_item${testimonial.id}_text`]}
                    fallback={testimonial.text}
                    width="18rem"
                  />
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
