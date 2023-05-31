import { prisma } from "../../../../../lib/prisma";
import { verifyJwt } from "../../../../../lib/jwt";



export async function GET(req: Request,  { params }: { params: { id: number } }) {

    const acessToken = req.headers.get("authorization");

    if(!acessToken || !verifyJwt(acessToken)){
       return new Response(JSON.stringify({
        error: "unauthorized"
       }),
       {
        status: 401
       }
       )
    }

    const userPosts = await prisma.post.findMany({
        where: { authorId: params.id.toString() },
        include: {
           author: {
            select: {
                email: true,
                name: true
            }
           }
        } 
    }) 

    return new Response(JSON.stringify(userPosts)); 
}