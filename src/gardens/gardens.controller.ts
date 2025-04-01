import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { GardensService } from './gardens.service';
import { CreateGardenDto } from './dto/create-garden.dto';
import { UpdateGardenDto } from './dto/update-garden.dto';

@Controller('gardens')
export class GardensController {

  constructor(private readonly gardensService: GardensService){}

  @ApiBearerAuth()
  @ApiOperation({description: "Add new garden"})
  @Post()
  create(@Request() req, @Body() createGardenDto: CreateGardenDto){
    return this.gardensService.create(req.user, createGardenDto);
  }

  @ApiBearerAuth()
  @ApiOperation({description: "Get the list of gardens. If the limit > 100, it will be set to 5 (preventing overload)"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Get()
  findMany(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.gardensService.findMany(req.user, page, limit, sortBy, sortOrder);
  }

  @ApiBearerAuth()
  @ApiOperation({description: 'Get a garden by id'})
  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) gardenId: number){
    return this.gardensService.findOne(req.user, gardenId);
  }

  @ApiBearerAuth()
  @ApiOperation({description: 'Update a garden'})
  @Patch(':id')
  updateOne(@Request() req, @Param('id', ParseIntPipe) gardenId: number, @Body() updateGardenDto: UpdateGardenDto){
    return this.gardensService.update(req.user, gardenId, updateGardenDto);
  }

  @ApiBearerAuth()
  @ApiOperation({description: 'Delete a garden'})
  @Delete(':id')
  deleteOne(@Request() req, @Param('id', ParseIntPipe) gardenId: number) {
    return this.gardensService.delete(req.user, gardenId);
  }
}
