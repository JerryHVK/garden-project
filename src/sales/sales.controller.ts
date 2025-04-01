import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService){}

  @Public()
  @ApiBearerAuth()
  @ApiOperation({description: "Add new transaction / buy some vegetables"})
  @Post()
  create(@Body() saveTransactionDto: SaveTransactionDto){
    return this.salesService.create(saveTransactionDto);
  }
}
