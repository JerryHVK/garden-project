import { Controller, Post, Body, Request, ParseIntPipe, Param, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
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

  @ApiBearerAuth()
  @ApiOperation({description: "Get the total sale of each garden belong to user"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Post('/gardens')
  getTotalSalesOfGardens(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.salesService.getTotalSalesOfGardens(req.user, page, limit, sortBy, sortOrder)
  }

  @ApiBearerAuth()
  @ApiOperation({description: "Get the total sale of each kind of vegetable in a garden"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Post('/gardens/:id')
  getSalesOfOneGarden(
    @Request() req, 
    @Param('id', ParseIntPipe) gardenId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.salesService.getSalesOfOneGarden(req.user, gardenId, page, limit, sortBy, sortOrder);
  }
}
