import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VegetablesService } from './vegetables.service';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { UpdateVegetablePriceDto } from './dto/update-vegetable-price.dto';

@Controller('vegetables')
export class VegetablesController {


  constructor(private vegetablesService: VegetablesService){}








  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // API for Vegetable

  // TODO: Create new vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Add new vegetable'})
  @Post() // add new vegetable
  create(@Request() req, @Body() createVegetableDto: CreateVegetableDto){
    return this.vegetablesService.create(req.user.id, createVegetableDto);
  }


  // TODO: Get the list of vegetables
  @ApiBearerAuth()
  @ApiOperation({description: "Get the list of vegetables. If the limit > 100, it will be set to 5 (preventing overload)"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @ApiQuery({ name: 'gardenId', required: true, type: Number, description: 'Id of garden that vegetables belong to' })
  @Get() // tìm danh sách rau -> có thể lọc để tìm rau theo khu vườn ở đây, để front-end quyết định việc đó, mình còn chưa thực hiện việc lọc ở đây cơ
  findMany(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
    @Query('gardenId', ParseIntPipe) gardenId: number,
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.vegetablesService.findMany(req.user.id, page, limit, sortBy, sortOrder, gardenId);
  }

  // TODO: Get the detail of one vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Get a vegetable by id'})
  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.findOne(req.user.id, vegetableId);
  }

  // TODO: Update the in-quantity, sale-quantity of one vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Update the in-quantity and sale-quantity of a vegetable'})
  @Patch(':id')
  updateOne(@Request() req, @Param('id', ParseIntPipe) vegetableId: number, @Body() updateVegetableDto: UpdateVegetableDto){
    return this.vegetablesService.updateOne(req.user.id, vegetableId, updateVegetableDto);
  }












  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // API for Price of Vegetable

  // TODO: Get the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Get price of a vegetable'})
  @Get(':id/price')
  getPrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.getPrice(req.user.id, vegetableId);
  }

  // TODO: Update the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Update price of a vegetable'})
  @Patch(':id/price')
  updatePrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number, @Body() updateVegetablePriceDto: UpdateVegetablePriceDto){
    return this.vegetablesService.updatePrice(req.user.id, vegetableId, updateVegetablePriceDto);
  }

  // TODO: Delte the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Delete price of a vegetable'})
  @Delete(':id/price')
  deletePrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.deletePrice(req.user.id, vegetableId);
  }

  
}
