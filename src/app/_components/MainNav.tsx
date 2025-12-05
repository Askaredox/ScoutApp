import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';


const navigation = [
    { name: 'Características', href: '/features' },
    { name: 'Acerca de', href: '/about' },
    { name: 'Contacto', href: '/contact' },
]

const MainNav: React.FC = () => {
    const [toggleModal, setToggleModal] = React.useState(false);
    const [scrolled, setScrolled] = React.useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;

            setScrolled(position < 70);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>

            <nav className={"fixed w-full z-20 top-0 start-0 border-b border-default " + (scrolled ? 'bg-transparent' : 'bg-white') + " transition-colors duration-300"}>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                        <Image
                            alt="Scouteca Logo"
                            src="logo.svg"
                            className="h-8 w-auto"
                            width={32}
                            height={32}
                        />
                        <span className={"self-center text-xl text-heading font-semibold whitespace-nowrap " + (scrolled ? 'text-white' : 'text-gray-900')}>Scouteca</span>
                    </Link>
                    <div className={"flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse " + (scrolled ? 'text-white' : 'text-gray-900')}>
                        <a href="/login" type="button" className="text-white bg-blue-700 hover:bg-blue-800 rounded-xl box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-3 py-2 focus:outline-none">
                            Ingresar
                        </a>
                        <button data-collapse-toggle="navbar-sticky" onClick={() => setToggleModal(!toggleModal)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-body rounded-base md:hidden hover:bg-neutral-secondary-soft hover:text-heading focus:outline-none focus:ring-2 focus:ring-neutral-tertiary" aria-controls="navbar-sticky" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" /></svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                        <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-default rounded-base bg-neutral-secondary-soft md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-neutral-primary">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a key={item.name} href={item.href} className={"block py-2 px-3 bg-brand rounded-sm transition ease-in-out duration-300 md:bg-transparent md:text-fg-brand md:p-0 hover:underline " + (scrolled ? 'text-white' : 'text-gray-900')} aria-current="page">{item.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </nav>
            <div id="dropdown" className={" fixed top-16 right-4 z-40 bg-gray-900 rounded-lg shadow-lg w-44 " + (toggleModal ? "" : "hidden")}>
                <ul className="p-2 text-sm text-body font-medium" aria-labelledby="dropdownDefaultButton">
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <a key={item.name} href={item.href} className={"inline-flex items-center w-full p-2 hover:bg-gray-800 hover:text-heading rounded " + (scrolled ? 'text-white' : 'text-gray-900')}>{item.name}</a>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
};

export default MainNav;