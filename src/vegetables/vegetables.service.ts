import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetablePriceDto } from './dto/update-vegetable-price.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { ResponseObject } from 'src/common/response-object';

@Injectable()
export class VegetablesService {

  constructor(private prisma: PrismaService){}

  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Common function

  // query user's infor using userId
  async checkUserId(userId: number){
    return await this.prisma.user.findUnique({where: {id: userId}});
  }

  // query garden's infor using userId and gardenId
  async checkGardenId(userId: number, gardenId: number){
    return await this.prisma.garden.findUnique({where: {id: gardenId, userId: userId}});
  }

  // query vegetable's infor using userId and vegetableId
  async checkVegetableId(userId: number, vegetableId: number){
    return await this.prisma.vegetable.findUnique({
      include: {garden: true},
      where: {id: vegetableId}
    });
  }



  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Function for Vegetable

  // TODO: add new vegetable
  async create(userId: number, createVegetableDto: CreateVegetableDto){
    const garden = this.checkGardenId(userId, createVegetableDto.gardenId);
    if(!garden){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }

    const newVegetable = this.prisma.vegetable.create({
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
    userId: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    gardenId: number,
  ){
    const garden = this.checkGardenId(userId, gardenId);
    if(!garden){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }
    // return await this.prisma.vegetable.findMany({where: })
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
  async findOne(userId: number, vegetableId: number){
    const vegetable = await this.checkVegetableId(userId, vegetableId);
    if(!vegetable || userId != vegetable.garden.userId){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    return new ResponseObject(HttpStatus.OK, "success", vegetable);
  }

  // TODO: update the in-quantity, sale-quantity of one vegetable
  async updateOne(userId: number, vegetableId: number, updateVegetableDto: UpdateVegetableDto){

    if(!updateVegetableDto.name && !updateVegetableDto.inQuantity && !updateVegetableDto.saleQuantity){
      return new ResponseObject(HttpStatus.OK, "No data to update");
    }

    const vegetable = await this.checkVegetableId(userId, vegetableId);
    if(!vegetable || userId != vegetable.garden.userId){
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








  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // Function for Price of Vegetable

  // TODO: get the price
  async getPrice(userId: number, vegetableId: number){
    const vegetable = await this.checkVegetableId(userId, vegetableId);
    if(!vegetable || userId != vegetable.garden.userId){
      return new ResponseObject(HttpStatus.OK, "Invalid vegetableId");
    }

    return new ResponseObject(HttpStatus.OK, "success", vegetable.price);
  } 

  // TODO: update the price
  async updatePrice(userId: number, vegetableId: number, updateVegetablePriceDto: UpdateVegetablePriceDto){
    const vegetable = await this.checkVegetableId(userId, vegetableId);
    if(!vegetable || userId != vegetable.garden.userId){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const updatedVegetablePrice = this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {price: updateVegetablePriceDto.price}
    });

    return new ResponseObject(HttpStatus.OK, "Updated vegetable's price successfully", updatedVegetablePrice);
  }
  

  // TODO: get the price
  async deletePrice(userId: number, vegetableId: number){
    const vegetable = await this.checkVegetableId(userId, vegetableId);
    if(!vegetable || userId != vegetable.garden.userId){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const deletedVegetablePrice = this.prisma.vegetable.update({
      where: {id: vegetableId},
      data: {price: null}
    });

    return new ResponseObject(HttpStatus.OK, "Deleted vegetable's price successfully", deletedVegetablePrice);
  }

}
