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
}
