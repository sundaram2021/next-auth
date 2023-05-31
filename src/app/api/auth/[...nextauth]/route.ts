// import NextAuth from 'next-auth'
// import GoogleProvider from 'next-auth/providers/google'
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();



// export const authOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string ,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
//     }),
//     CredentialsProvider({
//       type: "credentials",
//       credentials: {},
//       async authorize(credentials, req) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };

//         console.log(email);
        
      
//         try {
//           const res = await prisma.user.create({
//             data: {
//               email,
//               password
//             }
//           });
      
//           console.log('User created:', res);
      
//           return res;
//         } catch (error) {
//           console.error('Error creating user:', error);
//           throw new Error('Failed to create user.');
//         }
//       }
//     }),
//   ],
//   pages: {
//     signIn: '/register'
//   }
// }

// const handler = NextAuth(authOptions)

// export { handler as GET, handler as POST }


import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        name: { label: "name", type: "text", placeholder: "jsmith" },
        email: { label: "email", type: "text", placeholder: "jsmith@test.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch("http://localhost:3000/api/login", {
          method: 'POST',
          body: JSON.stringify({name: credentials?.name, email: credentials?.email, password: credentials?.password }),
          headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
  
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
  session : {
    maxAge: 604800 
  },
  callbacks: {
    async jwt({token, user}){
      return { ...token, ...user }
    },

    async session({session, token}){
      session.user = token as any;

      return session
    }
  },
});

export { handler as GET, handler as POST }