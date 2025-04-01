import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';
import { ResponseObject } from 'src/common/response-object';
import { Role } from 'src/common/role.enum';

@Injectable()
export class GardensService {
  constructor(private prisma: PrismaService) {}

  async checkExistingGarden(gardenId: number){
    const existingGarden = await this.prisma.garden.findUnique({where: {id: gardenId}});
    return existingGarden;
  }

  async create(user: any, createGardenDto: CreateGardenDto) {
    const newGarden = await this.prisma.garden.create({
      data: {
        userId: user.id,
        name: createGardenDto.name
      }
    })

    return new ResponseObject(HttpStatus.CREATED, "Created new garden successfully", newGarden);
  }

  async findMany(
    user: any,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ) {
    const skip = (page-1)*limit;
    let gardens;
    if(user.role == Role.Admin){
      gardens = await this.prisma.garden.findMany({
        take: limit,
        skip,
        orderBy:{
          [sortBy]: sortOrder
        }
      });
    }
    else if(user.role == Role.User){
      gardens = await this.prisma.garden.findMany({
        take: limit,
        skip,
        orderBy:{
          [sortBy]: sortOrder
        },
        where:{
          userId: user.id
        }
      });
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }

    return new ResponseObject(HttpStatus.OK, "success", gardens);
  }

  async findOne(user: any, gardenId: number) {
    const garden = await this.checkExistingGarden(gardenId);
    if(user.role == Role.Admin){
      if(!garden){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else if(user.role == Role.User){
      if(!garden || garden.userId != user.userId){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }
    
    

    return new ResponseObject(HttpStatus.OK, "success", garden);
  }

  async update(user: any, gardenId: number, updateGardenDto: UpdateGardenDto) {
    const garden = await this.checkExistingGarden(gardenId);
    if(!garden){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }

    const updatedGarden = await this.prisma.garden.update({
      where: {id: gardenId},
      data: {
        name: updateGardenDto.name
      }
    })

    return new ResponseObject(HttpStatus.OK, "Updated garden successfully", updatedGarden);
  }

  async delete(user: any, gardenId: number) {
    const garden = await this.checkExistingGarden(gardenId);
    if(!garden){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }

    await this.prisma.garden.delete({where: {id: gardenId}});

    return new ResponseObject(HttpStatus.NO_CONTENT, "Deleted garden successfully");
  }
}
