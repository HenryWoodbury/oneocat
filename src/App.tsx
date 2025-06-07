import './App.css'

function App() {

  return (
    <>
      <h1>Henry Woodbury</h1>
      {/* 
      <div className="tagline">
        <p>
          <a href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank">There are only two hard things in Computer Science: cache invalidation and naming things.</a>
        </p>
      </div>
      */}
      <div className="card">
        <h2>Sites I've designed and coded:</h2>
        <ul>
          <li><a href="https://www.jcoral.com/" target="_blank">Coral Woodbury (artist porfolio)</a></li>
          <li><a href="https://refassist.ieee.org/" target="_blank">IEEE Reference Preparation Assistant</a></li>
          <li>Other <strong>IEEE</strong> projects can be presented in person</li>
        </ul>
        <h2>Personal project:</h2>
        <ul>
          <li><a href="https://github.com/HenryWoodbury/batcast/wiki" target="_blank">Batcast (a Google Chrome Extension)</a></li>
        </ul>
        <h2>Online presence:</h2>
        <ul>
          <li><a href="https://oneocat.substack.com/" target="_blank">Substack</a></li>
          <li><a href="https://www.linkedin.com/in/henry-woodbury-35b02737/" target="_blank">LinkedIn</a></li>
          <li><a href="https://github.com/HenryWoodbury">Github</a></li>
        </ul>
      </div>
    </>
  )
}

export default App
