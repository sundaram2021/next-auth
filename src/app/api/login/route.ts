import { signJwtAccessToken } from "../../../../lib/jwt";
import { prisma } from "../../../../lib/prisma";
import bcrypt from 'bcrypt';

interface RequestBody {
    name: string,
    email: string,
    password: string
}


export async function POST(req:Request) {
    const body: RequestBody = await req.json();

    const  user = await prisma.user.findFirst({
        where: {
            email: body.email,
        }
    })

    async function comparePasswords(userPassword: string, bodyPassword: string): Promise<boolean> {
      // console.log('user password', userPassword);
      // console.log('body password', bodyPassword);
        
      try {
        const passwordMatch = await bcrypt.compare(bodyPassword, userPassword);
        return passwordMatch;
      } catch (error) {
        // Handle the error, e.g., log or throw an exception
        // console.error('Error comparing passwords:', error);
        return false;
      }
    }

    if(user && (await comparePasswords(user.password, body.password))){
      const { password, ...userWithoutPassword } = user;
      console.log(userWithoutPassword);

      const acessToken =  signJwtAccessToken(userWithoutPassword)
      const result = {
        ...userWithoutPassword,
        acessToken
      }   
      return new Response(JSON.stringify(result)) 
    }

    else {
      console.log('uuuu ');
        
      return new Response(JSON.stringify(null));
    }
}