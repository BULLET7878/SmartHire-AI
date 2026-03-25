import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="w-full border-t border-white/5 bg-black/60 backdrop-blur-md py-8 mt-auto z-10 relative">
            <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <Logo />
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest text-center md:text-left">
                    &copy; {new Date().getFullYear()} Rahul Dhakad. All rights reserved. Built with ❤️
                </p>

            </div>
        </footer>
    );
};

export default Footer;
