import { Prisma, PrismaClient , type Event as PrismaEvent , type RSVP } from "@prisma/client";

const prisma = new PrismaClient();
interface EnrichEvent extends Omit<PrismaEvent , "group"> {
    isRSVPed: boolean;
    rsvpStatus: string | null;
    groupName:string;
    groupBanner:string | null;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  let attempt = 0;
  while (attempt < 3) {
    try {
      return await fn();
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2010'
      ) {
        attempt++;
        console.warn(`Retry ${attempt}/${retries} after timeout`);
        await new Promise(res => setTimeout(res, delay * attempt));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeds');
}

export const getUserProfile = async (userId:string) => {
    return withRetry(async() => await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select:{
                id:true,
                name:true,
                email:true,
                bio:true,
                profilePic:true,
                interests:true,
                lookingTo:true,
                aboutMe:true,
                location:true,
            }
    }));
}

export const updateUserProfile = async (userId:string , data:Partial<{
    bio:string;
    lookingTo:string[];
    aboutMe:string[];
    interests:string[];
    profilePic?:string;
}>) => {
    return withRetry(async() => {
        return prisma.user.update({
            where:{
                id:userId,
            },
            data
        })
    })
}

export const getUserRSVPs = async(userId:string, page:number =1 , limit:number = 10):Promise<(RSVP &{event : PrismaEvent})[]> => {
  const skip = (page-1) * limit;
  return withRetry(async() => {
    return prisma.rSVP.findMany({
      where:{
        id:userId
      },
      include:{event:true},
      skip,
      take:limit,
      orderBy:{
        createdAt:"desc"
      }
    })
  })

}


export const getUserGroups = async(userId:string , page:number=1 , limit:number = 10) => {
  const skip = (page-1) * limit;
  return withRetry(async() => {
    return prisma.userOnGroup.findMany({
      where:{id:userId},
      include:{
        group:{
          select:{
            id:true,
            name:true,
            banner:true,
            location:true,
            topics:true,
            _count:{
              select:{
                events:true,
              }
            }
          }
        }
      },
      skip,
      take:limit
    })
  })
}