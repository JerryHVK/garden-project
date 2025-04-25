import { HttpStatus, Injectable, Res, StreamableFile } from '@nestjs/common';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetablePriceDto } from './dto/update-vegetable-price.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { ResponseObject } from 'src/common/response-object';
import { GardensService } from 'src/gardens/gardens.service';
import { Role } from 'src/common/role.enum';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class VegetablesService {

  constructor(private prisma: PrismaService, private gardensService: GardensService){}

  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Common function

  async checkExistingVegetable(vegetableId: number){
    return await this.prisma.vegetable.findUnique({
      where: {id: vegetableId}
    });
  }



  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Function for Vegetable

  // TODO: add new vegetable
  async create(user: any, createVegetableDto: CreateVegetableDto){
    const garden = await this.gardensService.checkExistingGarden(createVegetableDto.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }

    const newVegetable = await this.prisma.vegetable.create({
      data: {
        name: createVegetableDto.name,
        inQuantity: createVegetableDto.inQuantity || null,
        saleQuantity: createVegetableDto.saleQuantity || null,
        price: createVegetableDto.price || null,
        gardenId: createVegetableDto.gardenId
      }
    });

    return new ResponseObject(HttpStatus.CREATED, "Added new vegetable successfully", newVegetable);
  }

  // TODO: get the list of vegetables
  async findMany(
    user: any,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    gardenId: number,
  ){
    const garden = await this.gardensService.checkExistingGarden(gardenId);

    if(user.role == Role.Admin){
      if(!garden){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else if(user.role == Role.User){
      if(!garden || garden.userId != user.id){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }
    const skip = (page-1)*limit;
    
    const vegetables = await this.prisma.vegetable.findMany({
      take: limit,
      skip: skip,
      orderBy:{
        [sortBy]: sortOrder
      },
      where:{
        gardenId: gardenId
      }
    })

    return new ResponseObject(HttpStatus.OK, "success", vegetables);
  }

  // TODO: get the detail of one vegetables
  async findOne(user: any, vegetableId: number){
    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(user.role == Role.Admin){
      if(!garden){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
      }
    }
    else if(user.role == Role.User){
      if(!garden || garden.userId != user.id){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }

    return new ResponseObject(HttpStatus.OK, "success", vegetable);
  }

  // TODO: update the in-quantity, sale-quantity of one vegetable
  async updateOne(user: any, vegetableId: number, updateVegetableDto: UpdateVegetableDto){

    if(!updateVegetableDto.name && !updateVegetableDto.inQuantity && !updateVegetableDto.saleQuantity){
      return new ResponseObject(HttpStatus.OK, "No data to update");
    }

    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const updatedVegetable = await this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {
        name: updateVegetableDto.name || vegetable.name,
        inQuantity: updateVegetableDto.inQuantity || vegetable.inQuantity,
        saleQuantity: updateVegetableDto.saleQuantity || vegetable.saleQuantity
      }
    });

    return new ResponseObject(HttpStatus.OK, "Updated vegetable successfully", updatedVegetable);
  }


  // TODO: update the images
  async updateImage(user: any, vegetableId: number, file: Express.Multer.File){
    if(!file){
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Invalid file');
    }

    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const updatedVegetable = await this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {
        imageUrl: file.filename
      }
    });
    
    return new ResponseObject(HttpStatus.OK, "Updated image successfully", updatedVegetable);
  }


  // TODO: get the vegetable image
  async getImage(user: any, vegetableId: number){
    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    if(!vegetable.imageUrl){
      return new ResponseObject(HttpStatus.NO_CONTENT, 'No image uploaded');
    }

    const file = createReadStream(join('src/files/images/vegetables', vegetable.imageUrl));
    return new StreamableFile(file);
  }








  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Function for Price of Vegetable

  // TODO: get the price
  async getPrice(user: any, vegetableId: number){
    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(user.role == Role.Admin){
      if(!garden){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
      }
    }
    else if(user.role == Role.User){
      if(!garden || garden.userId != user.id){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }

    return new ResponseObject(HttpStatus.OK, "success", vegetable.price);
  } 

  // TODO: update the price
  async updatePrice(user: any, vegetableId: number, updateVegetablePriceDto: UpdateVegetablePriceDto){
    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const updatedVegetablePrice = await this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {price: updateVegetablePriceDto.price}
    });

    return new ResponseObject(HttpStatus.OK, "Updated vegetable's price successfully", updatedVegetablePrice);
  }
  

  // TODO: get the price
  async deletePrice(user: any, vegetableId: number){
    // check if the vegetable id is valid
    const vegetable = await this.prisma.vegetable.findUnique({where: {id: vegetableId}});
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    // check if the vegetable belongs to the garden of this user
    const garden = await this.gardensService.checkExistingGarden(vegetable.gardenId);
    if(!garden || garden.userId != user.id){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const deletedVegetablePrice = await this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {price: null}
    });

    return new ResponseObject(HttpStatus.OK, "Deleted vegetable's price successfully", deletedVegetablePrice);
  }

}
