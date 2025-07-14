import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import '../../styles/constants/Introduce.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import beginning from '../../assets/begin.png';
import transpapency from '../../assets/trans.png';
import sustainability from '../../assets/safety.png';
import inclusion from '../../assets/inclusion.jpg';
import differ1 from '../../assets/diff1.png';
import differ2 from '../../assets/diff2.png';
import experience from '../../assets/shop.jpg';
import Reason from '../../components/Reason/Reason'
import Insta from '../../components/Insta/Instagram';

const videoUrl = 'https://cdn.builder.io/o/assets%2F9f2a69003c86470ea05deb9ecb9887be%2Fe0e14f01688242cda1248f61fa4bd547%2Fcompressed?apiKey=b47f39b49d994f41bd8e68fa9258a402&token=e0e14f01688242cda1248f61fa4bd547&alt=media&optimized=true';

const Introduce = () => {
    const breadcrumbItems = [
        { name: 'Home', link: '/' },
        { name: 'Introduce', link: '/introduce' }
    ];
    const navigate = useNavigate();

    const handleNavigate = (path, state) => {
        navigate(path, { state });
    };

    useEffect(() => {
        document.title = "Alurà - Introduce";
    }, []);

    return (
        <div className="Introduce">
            <Breadcrumb items={breadcrumbItems} />

            {/* Banner */}
            <div className="banner-container">
                <video className="banner-video" autoPlay loop muted>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="banner-content">
                    <h2>BEAUTY REIMAGINED</h2>
                    <p>We deliver advanced cosmetic and skincare treatments tailored to your unique beauty journey. Redefine your confidence with us.</p>
                </div>
            </div>

            {/* Beginning */}
            <div className="introduce_beginning container">
                <div className="row">
                    <div className="introduce_beginning_left col-lg-6 col-md-6 col-sm-12">
                        <h3>OUR STORY</h3>
                        <div className="introduce_beginning_underline"></div>
                        <p>Founded in 2010 by a team of skincare specialists, aesthetic doctors, and wellness experts, our clinic was born out of a shared vision: to make high-quality cosmetic care safe, effective, and accessible to all. We saw a need for a clinic that prioritized both natural results and patient trust.</p>
                        <p>Over the years, we've helped thousands of clients achieve radiant skin, enhanced features, and renewed confidence through non-invasive and minimally invasive treatments.</p>
                    </div>
                    <div className="introduce_beginning_right col-lg-6 col-md-6 col-sm-12">
                        <img src={beginning} alt="Our Clinic" />
                        <p className="beginning_left_desc">“Our mission is to elevate confidence and well-being through trusted aesthetic and skincare treatments that prioritize health and results.”</p>
                    </div>
                </div>
            </div>

            {/* Mission */}
            <div className="mission_container">
                <div className="mission_description">
                    <p>Our purpose is to redefine beauty through science-backed treatments, compassion-driven care, and a commitment to transparency, sustainability, and inclusivity in aesthetic medicine.</p>
                </div>
                <h4 className="misson_title">OUR GUIDING VALUES</h4>
                <div className='container'>
                    <div className="mission_columns row">
                        <div className="mission_column1 col-lg-4 col-md-4 col-sm-12">
                            <div className='mission_column1_img'>
                                <img src={transpapency} alt="Transparency" />
                            </div>
                            <div className='mission_column1_content'>
                                <h3 className="mission_sub_title_1">TRANSPARENCY</h3>
                                <p className="mission_sub_description_1">We clearly explain every treatment, from ingredients and techniques to outcomes, so you always feel informed and empowered in your choices.</p>
                            </div>
                        </div>
                        <div className="mission_column2 col-lg-4 col-md-4 col-sm-12">
                            <div className='mission_column2_img'>
                                <img src={sustainability} alt="Sustainability" />
                            </div>
                            <div className='mission_column1_content'>
                                <h3 className="mission_sub_title_2">SAFETY & CARE</h3>
                                <p className="mission_sub_description_2">We use FDA-approved equipment and clinically-tested products in a hygienic, caring environment to ensure the highest safety standards.</p>
                            </div>
                        </div>
                        <div className="mission_column3 col-lg-4 col-md-4 col-sm-12">
                            <div className='mission_column3_img'>
                                <img src={inclusion} alt="Inclusion" />
                            </div>
                            <div className='mission_column1_content'>
                                <h3 className="mission_sub_title_3">INCLUSION</h3>
                                <p className="mission_sub_description_3">Beauty is for everyone. Our services are inclusive of all skin types, tones, ages, and identities, designed to enhance your natural beauty.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience */}
            <div className="introduce_experience container">
                <div className="row">
                    <div className="introduce_experience_left col-lg-6 col-md-6 col-sm-12">
                        <h3>YOUR JOURNEY MATTERS</h3>
                        <div className="introduce_experience_underline"></div>
                        <p>From personalized consultations to expert treatments, our approach is tailored to your skin goals and comfort. Whether you're treating acne, wrinkles, pigmentation, or simply seeking a glow-up, we’re here to help you feel your best.</p>
                        <button onClick={() => handleNavigate('/cosmetics', { category: 'all' })} className="introduce_shop_now_btn">Explore cosmetics</button>
                    </div>
                    <div className="introduce_experience_right col-lg-6 col-md-6 col-sm-12">
                        <img src={experience} alt="Client Experience" />
                    </div>
                </div>
            </div>

            <br /><br />

            {/* Difference */}
            <div className="difference_container">
                <h3 className="difference_title">THE ALURÀ DIFFERENCE</h3>
                <div className='container'>
                    <div className="difference_1 row">
                        <div className="difference_1_left col-lg-6 col-md-6 col-sm-12">
                            <h3 className="difference_1_title">TAILORED TREATMENTS</h3>
                            <div className="difference_1_underline"></div>
                            <p className="difference_1_description">Every individual’s skin is different, with unique concerns, sensitivities, and goals. That’s why we don’t believe in one-size-fits-all solutions. At our clinic, our experienced dermatologists and aesthetic doctors conduct thorough consultations using cutting-edge diagnostic tools to analyze your skin's exact condition. Based on these insights, we develop fully customized treatment plans that align with your specific needs and expectations. </p>
                        </div>
                        <div className="difference_1_right col-lg-6 col-md-6 col-sm-12">
                            <img src={differ1} alt="Tailored Treatment" />
                        </div>
                    </div>
                    <div className="difference_2 row">
                        <div className="difference_2_left col-lg-6 col-md-6 col-sm-12">
                            <img src={differ2} alt="Ethical Practices" />
                        </div>
                        <div className="difference_2_right col-lg-6 col-md-6 col-sm-12">
                            <h3 className="difference_2_title">ETHICAL & EFFECTIVE CARE</h3>
                            <div className="difference_2_underline"></div>
                            <p className="difference_2_description">We are deeply committed to delivering real, visible results that stand the test of time — without compromising your safety or comfort. We understand that choosing a cosmetic treatment is a big decision, which is why we only offer procedures that are backed by scientific research and proven clinical outcomes. Our team stays at the forefront of the industry, continually updating our protocols to reflect the latest innovations in non-invasive and minimally invasive treatments. </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Reason  */}
            <Reason></Reason>
            <br></br><br></br><br></br>
            <Insta />
        </div>
    );
};

export default Introduce;
