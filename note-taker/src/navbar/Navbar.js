import parse from 'html-react-parser'
import './navbar.css'

var md = require('markdown-it')(),
    mk = require('markdown-it-katex');
md.use(mk);

function Navbar() {
    return (
        <header>
            {parse(md.render("# T$e^x$t Notes"))}
        </header>
    )
}

export default Navbar;