// import React from 'react';

// function Footer() {
//   return (
//     <footer>
//       <div className="container">
//         <p className="m-0">
//         Air Quality and Its Impact on Health - COS30049 Computing Technology and Innovation Project - Team 29/Safety Windy
//         </p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;


import React from 'react';
import '../App.css'

function Footer() {
  return (
    <footer className="border-top">
      <div className="container px-4 px-lg-5">
        <div className="row gx-4 gx-lg-5 justify-content-center">
          <div className="col-md-10 col-lg-8 col-xl-7">
            <ul className="list-inline text-center">
              <li className="list-inline-item">
                <a href="#">
                  <span className="fa-stack fa-lg">
                    <i className="fas fa-circle fa-stack-2x"></i>
                    <i className="fab fa-github fa-stack-1x fa-inverse"></i>
                  </span>
                </a>
              </li>
            </ul>
            <div className="small text-center text-muted fst-italic">
              Copyright &copy; COS30049 Project 2024
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
