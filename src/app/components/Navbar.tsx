'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";


const Navbar = () => {

    const { data: session } = useSession();

    console.log(session?.user);
    

    return <nav className="text-white text-xl flex items-center justify-center gap-7 mt-2 cursor-pointer">
        <Link href='/'>Home</Link>
        {(session && session.user) ?<div onClick={() => signOut()}>Signout</div> : <div onClick={() => signIn()}>Signin</div>}
        <Link href='/profile'>Profile</Link>
    </nav>
};

export default Navbar;