import { Prisma } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";
import * as bcrypt from 'bcrypt';

interface RequestBody {
    name: string,
    email: string,
    password:  string
}


export async function POST(req: Request) {
    const body: RequestBody = await req.json();
  
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email, // Corrected property name from body.name to body.email
        password: await bcrypt.hash(body.password, 10)
      }as Prisma.UserCreateInput
    });

    const {password, ...result} = user;
    return new Response(JSON.stringify(result));
  }
  