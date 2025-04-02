import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { VegetablesService } from 'src/vegetables/vegetables.service';
import { ResponseObject } from 'src/common/response-object';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService, private vegetablesService: VegetablesService){}

  async create(saveTransactionDto: SaveTransactionDto){
    const vegetable = await this.vegetablesService.checkExistingVegetable(saveTransactionDto.vegetableId);
    if(!vegetable){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid vegetableId");
    }

    const sale = await this.prisma.sale.create({
      data: {
        quantity: saveTransactionDto.quantity,
        totalPrice: saveTransactionDto.totalPrice,
        vegetableId: saveTransactionDto.vegetableId,
        gardenId: vegetable.gardenId
      }
    })
    return new ResponseObject(HttpStatus.CREATED, "success", sale);
  }


  async getTotalSalesOfGardens(
    user: any,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ){
    const skip = (page-1)*limit;
    const totalSales = await this.prisma.garden.findMany({
      take: limit,
      skip,
      where: {
        userId: user.id, // Filter by the userId
      },
      select: {
        id: true,
        name: true,
        sales: {
          select: {
            totalPrice: true, // Select the totalPrice from Sale model
          },
        },
      },
    });
    
    const gardensWithTotalSales = totalSales.map(garden => ({
      gardenId: garden.id,
      gardenName: garden.name,
      totalSale: garden.sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0), // Sum up totalPrice for each garden
    }));
    
    return new ResponseObject(HttpStatus.OK, 'success', gardensWithTotalSales);
  }

  async getSalesOfOneGarden(
    user: any, 
    gardenId: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ){
    const skip = (page-1)*limit;
    const totalVegetableSales = await this.prisma.vegetable.findMany({
      take: limit,
      skip,
      where: {
        gardenId: gardenId, // Filter by gardenId
      },
      select: {
        id: true,
        name: true,
        sales: {
          select: {
            totalPrice: true, // Select totalPrice from the Sale model
          },
        },
      },
    });
    
    const vegetablesWithTotalSales = totalVegetableSales.map(vegetable => ({
      vegetableId: vegetable.id,
      vegetableName: vegetable.name,
      totalSale: vegetable.sales.reduce((sum, sale) => sum + (sale.totalPrice || 0), 0),
    }));

    
    return new ResponseObject(HttpStatus.OK, 'success', vegetablesWithTotalSales);
  }

  
}
