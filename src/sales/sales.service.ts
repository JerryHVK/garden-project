import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { VegetablesService } from 'src/vegetables/vegetables.service';
import { ResponseObject } from 'src/common/response-object';
import { Role } from 'src/common/role.enum';
import { GardensService } from 'src/gardens/gardens.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SalesService {
  constructor(
    private prisma: PrismaService, 
    private vegetablesService: VegetablesService, 
    private gardensService: GardensService,
    private userService: UserService,
  ){}

  async getTotalSalesOfOneVegetable(vegetableId: number): Promise<number>{
    const sales = await this.prisma.sale.findMany({
      where: {vegetableId: vegetableId},
      select: {totalPrice: true},
    });
    let totalSales = 0;
    for(let sale of sales){
      if(sale.totalPrice){
        totalSales += sale.totalPrice;
      }
    }
    return totalSales;
  }

  async getTotalSalesOfOneGarden(gardenId: number): Promise<number>{
    const sales = await this.prisma.sale.findMany({
      where: {gardenId: gardenId},
      select: {totalPrice: true},
    });
    let totalSales = 0;
    for(let sale of sales){
      if(sale.totalPrice){
        totalSales += sale.totalPrice;
      }
    }
    return totalSales;
  }

  async getTotalSalesOfOneUser(userId: number): Promise<number>{
    const gardens = await this.prisma.garden.findMany({
      where: {userId: userId},
      select: {id: true},
    });
    let totalSales = 0;
    for(let garden of gardens){
      totalSales += await this.getTotalSalesOfOneGarden(garden.id);
    }
    // console.log("User total sales: ", totalSales)
    return totalSales;
  }

  async getSalesOfUsers(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ){
    const skip = (page-1)*limit;
    const users = await this.prisma.user.findMany({
      take: limit,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
      },
      where: {
        role: Role.User,
      }
    });
    
    interface Result {
      userId: number,
      userName: string,
      email: string,
      totalSales: number,
    };
    const result: Result[] = [];

    for(let user of users){
      const totalSales = await this.getTotalSalesOfOneUser(user.id);
      result.push({
        userId: user.id,
        userName: user.name,
        email: user.email,
        totalSales: totalSales
      });
    }
    return new ResponseObject(HttpStatus.OK, "success", result);
  }

  async getSalesOfOneUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ){
    const user = await this.userService.checkExistingUserId(userId);
    if(!user){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid userId");
    }

    const skip = (page-1)*limit;
    const gardens = await this.prisma.garden.findMany({
      take: limit,
      skip,
      where: {userId: userId},
      select: {
        id: true,
        name: true,
      },
    });

    interface Result {
      gardenId: number,
      gardenName: string,
      ownerName: string,
      totalSales: number,
    };
    const result: Result[] = [];

    for(let garden of gardens){
      const totalSales = await this.getTotalSalesOfOneGarden(garden.id);
      result.push({
        gardenId: garden.id,
        gardenName: garden.name,
        ownerName: user.name,
        totalSales,
      });
    }
    return new ResponseObject(HttpStatus.OK, "success", result); 
  }

  async getSalesOfOneGarden(
    user: any,
    gardenId: number,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ){
    const garden = await this.gardensService.checkExistingGarden(gardenId);
    if(!garden){
      return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
    }

    if(user.role == Role.Admin){

    }
    else if(user.role == Role.User){
      if(garden.userId != user.id){
        return new ResponseObject(HttpStatus.BAD_REQUEST, "Invalid gardenId");
      }
    }
    else{
      return new ResponseObject(HttpStatus.BAD_REQUEST, "What is your role?");
    }

    const skip = (page-1)*limit;
    const vegetables = await this.prisma.vegetable.findMany({
      take: limit,
      skip,
      where: {gardenId: gardenId},
      select: {
        id: true,
        name: true,
      },
    });

    interface Result {
      vegetableId: number,
      vegetableName: string,
      totalSales: number,
    };
    const result: Result[] = [];

    for(let vegetable of vegetables){
      const totalSales = await this.getTotalSalesOfOneVegetable(vegetable.id);
      result.push({
        vegetableId: vegetable.id,
        vegetableName: vegetable.name,
        totalSales,
      });
    }
    return new ResponseObject(HttpStatus.OK, "success", result); 
  }
}
