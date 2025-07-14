import inspired1 from '../../assets/ins1.png';
import inspired2 from '../../assets/ins2.png';
import inspired3 from '../../assets/ins3.png';
import inspired4 from '../../assets/ins4.png';
import inspired5 from '../../assets/ins5.png';
import inspired6 from '../../assets/ins6.png';
import '../Insta/Instagram.css';

const Instagram = () => {
    return (
        <div className="blog_inspired_container">
            <div className="row">
                <div className="blog_inspired_grid">
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired1} alt="Inspired 1" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired2} alt="Inspired 2" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired3} alt="Inspired 3" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired4} alt="Inspired 4" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired5} alt="Inspired 5" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                    <div className="col-md-2 blog_inspired_column">
                        <div className="blog_inspired_image" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                            <img src={inspired6} alt="Inspired 6" />
                            <i className="fab fa-instagram inspired_icon"></i>
                        </div>
                    </div>
                </div>
                <div className="instagram_circle" onClick={() => window.open('https://www.instagram.com/alura', '_blank')}>
                    <i className="fab fa-instagram"></i>
                </div>
            </div>
        </div>
    );
};

export default Instagram;
