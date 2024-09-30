import React from 'react';
import '../stylesheets/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
      <h2>BuildResume</h2>
        <div className="company-info">
          
          {/* company infos and docs will be tbc */}
          <h2>Company</h2>
          <ul>
            <li><a href="#">Docs</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">LinkedIn</a></li>
          </ul>
        </div>
        <div className="legal-info">
          <h2>Legal</h2>
          <ul>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">DPA</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 BuildResy Ltd</p>
      </div>
    </footer>
  );
}

export default Footer;
