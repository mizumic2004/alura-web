import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import "../../styles/constants/Faqs.css";
import contact from "../../assets/faqContact.webp";
import faqsImg from "../../assets/faq.png";
import Insta from "../../components/Insta/Instagram";

function Faqs() {
  useEffect(() => {
    document.title = "Alurà - Frequently Asked Questions";
  }, []);

  const [transitionKey, setTransitionKey] = useState(Date.now());
  const breadcrumbItems = [
    { name: "Home", link: "/" },
    { name: "Frequently Asked Questions", link: "/faqs" },
  ];
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const faqs = [
    {
      question: "What types of cosmetic treatments do you offer?",
      answer:
        "We offer a wide range of non-surgical cosmetic treatments including facials, skin rejuvenation, Botox, dermal fillers, acne treatments, and laser hair removal.",
    },
    {
      question: "Is a consultation required before treatment?",
      answer:
        "Yes, we require an initial consultation to assess your skin, discuss your goals, and recommend the most suitable treatment plan tailored to your needs.",
    },
    {
      question: "Are your treatments safe?",
      answer:
        "Absolutely. All our procedures are performed by licensed professionals using FDA-approved equipment and products. Client safety is our top priority.",
    },
    {
      question: "How long do the results of cosmetic treatments last?",
      answer:
        "Results vary by treatment. For example, Botox typically lasts 3–4 months, while dermal fillers can last 6–12 months. Your provider will give you a detailed timeline.",
    },
    {
      question: "What should I do before my appointment?",
      answer:
        "Avoid direct sun exposure, alcohol, and active skincare ingredients like retinol 24 hours before your treatment. Specific pre-care instructions will be given upon booking.",
    },
    {
      question: "Is there any downtime after treatment?",
      answer:
        "Most treatments have minimal to no downtime. Some procedures may cause temporary redness, swelling, or sensitivity, which typically subsides within a few hours to a few days.",
    },
    {
      question: "Do you offer skincare products for home use?",
      answer:
        "Yes, we offer a curated selection of medical-grade skincare products to complement your treatments and maintain results at home.",
    },
    {
      question: "Can I wear makeup after my treatment?",
      answer:
        "It depends on the treatment. For some procedures, you should avoid makeup for 24 hours. Your specialist will provide specific aftercare instructions.",
    },
    {
      question: "Are your treatments suitable for all skin types?",
      answer:
        "Yes, we offer treatments tailored for various skin tones and types. During your consultation, we ensure that your chosen treatment is appropriate and safe for your skin.",
    },
    {
      question: "Do you treat acne and acne scars?",
      answer:
        "Yes, we provide advanced treatments for active acne and acne scarring, including chemical peels, laser therapy, and microneedling.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, digital wallets, and cash payments. You can select your preferred method during checkout.",
    },
    {
      question: "Do you offer packages or memberships?",
      answer:
        "Yes, we offer discounted packages for multiple sessions and exclusive membership plans with perks like priority booking and special pricing.",
    },
    {
      question: "Can I reschedule or cancel my appointment?",
      answer:
        "Yes, you can reschedule or cancel up to 24 hours before your appointment. Late cancellations may incur a fee. Contact our front desk for assistance.",
    },
    {
      question: "Do you provide treatment for pigmentation and dark spots?",
      answer:
        "Yes, we offer targeted treatments such as laser therapy and chemical peels to reduce hyperpigmentation and even out skin tone.",
    },
    {
      question: "How do I know which facial treatment is right for me?",
      answer:
        "During your consultation, our experts will assess your skin condition and goals to recommend the most suitable facial treatment for optimal results.",
    },
    {
      question: "Do you treat sensitive skin or rosacea?",
      answer:
        "Yes, we offer gentle, calming treatments designed specifically for sensitive skin and rosacea. Your safety and comfort are always our top priorities.",
    },
    {
      question: "Are results immediate after the treatment?",
      answer:
        "Some treatments deliver immediate results, while others show gradual improvements over days or weeks. Your provider will explain what to expect.",
    },
    {
      question: "Is there an age requirement for cosmetic treatments?",
      answer:
        "Yes, you must be at least 18 years old for most cosmetic procedures. Some treatments may be available for younger clients with parental consent.",
    },
    {
      question: "Can I combine different treatments in one visit?",
      answer:
        "In many cases, yes. We often recommend combination treatments for enhanced results. Your provider will guide you on safe and effective pairings.",
    },
    {
      question: "How do I book an appointment?",
      answer:
        "You can book an appointment directly through our website, call our clinic, or visit us in person. Online scheduling is available 24/7 for your convenience.",
    },
  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleFaqs = filteredFaqs.slice(0, visibleCount);

  const loadMoreFaqs = () => {
    setVisibleCount(visibleCount + 10);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.querySelector(".faqs_banner_container").classList.add("visible");
    }, 10);
    return () => clearTimeout(timeout);
  }, [transitionKey]);

  return (
    <div className="FAQs">
      <Breadcrumb items={breadcrumbItems} />

      {/* Main title */}
      <div
        key={transitionKey}
        className="faqs_banner_container"
        style={{ backgroundImage: `url(${faqsImg})` }}>
        <div className="faqs_banner_content">
          <h2>How can we help you?</h2>
        </div>
      </div>
      <br></br>
      <br></br>

      {/* Search Section */}
      <div className="faqs_search_section">
        <input
          type="text"
          className="faqs_search_input"
          placeholder="Search for question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="faqs_search_button">
          <i className="fas fa-search"></i>
        </button>
      </div>
      <br></br>
      <br></br>

      {/* Main FAQs section */}
      <div className="main_faqs_container">
        <h2 className="main_faqs_title">Frequently Asked Questions</h2>
        <p className="main_faqs_number">({filteredFaqs.length} questions)</p>
        {visibleFaqs.map((faq, index) => (
          <div key={index}>
            <hr className="main_faqs_line" />
            <div
              className="main_faqs_question"
              onClick={() => toggleFAQ(index)}>
              <h3 className="main_faqs_sub_title">
                {faq.question}{" "}
                <i
                  className={`fas fa-${
                    activeIndex === index ? "minus" : "plus"
                  }`}></i>
              </h3>
              {activeIndex === index && (
                <p className="main_faqs_description">{faq.answer}</p>
              )}
            </div>
          </div>
        ))}
        <hr className="main_faqs_line" />
        {visibleCount < filteredFaqs.length && (
          <button className="faqs_view_more_button" onClick={loadMoreFaqs}>
            View more
          </button>
        )}
      </div>
      <br></br>
      <br></br>

      {/* Still need help */}
      <div className="container faqs_help_container">
        <div className="row">
          <div className="col-lg-7 col-md-7 col-sm-12 faqs_help_content">
            <h2 className="faqs_help_title">Still need help?</h2>
            <p className="faqs_help_description">
              Whether you need more detailed information or have specific
              inquiries, don't hesitate to reach out.
            </p>
            <button className="faqs_help_btn" onClick={handleContactClick}>
              Contact us
            </button>
          </div>
          <div className="col-lg-5 col-md-5 col-sm-12 faqs_help_image">
            <img src={contact} alt="Contact Us" />
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <Insta />
    </div>
  );
}

export default Faqs;
