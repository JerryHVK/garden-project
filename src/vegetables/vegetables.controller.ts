import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VegetablesService } from './vegetables.service';
import { CreateVegetableDto } from './dto/create-vegetable.dto';
import { UpdateVegetableDto } from './dto/update-vegetable.dto';
import { UpdateVegetablePriceDto } from './dto/update-vegetable-price.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('vegetables')
export class VegetablesController {


  constructor(private vegetablesService: VegetablesService){}








  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // API for Vegetable

  // TODO: Create new vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Add new vegetable'})
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Post() // add new vegetable
  create(@Request() req, @Body() createVegetableDto: CreateVegetableDto){
    return this.vegetablesService.create(req.user, createVegetableDto);
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
    return this.vegetablesService.findMany(req.user, page, limit, sortBy, sortOrder, gardenId);
  }

  // TODO: Get the detail of one vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Get a vegetable by id'})
  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.findOne(req.user, vegetableId);
  }

  // TODO: Update the in-quantity, sale-quantity of one vegetable
  @ApiBearerAuth()
  @ApiOperation({description: 'Update the in-quantity and sale-quantity of a vegetable'})
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Patch(':id')
  updateOne(@Request() req, @Param('id', ParseIntPipe) vegetableId: number, @Body() updateVegetableDto: UpdateVegetableDto){
    return this.vegetablesService.updateOne(req.user, vegetableId, updateVegetableDto);
  }


  // TODO: Update the image for vegetable
  // api allow user to upload image
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Post(':id/image/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
      schema: {
          type: 'object',
          properties: {
              image: {
                  type: 'string',
                  format: 'binary',
              },
          },
      },
  })    
  @UseInterceptors(FileInterceptor(
      'image', 
      {
          storage: diskStorage({
          destination: 'src/files/images/vegetables',
          filename: (req, file, callback) => {
              const filename = `vegetable-${Date.now()}${extname(file.originalname)}`;
              callback(null, filename);
          }
      })
      }
  ))
  async uploadImage(@Request() req, @Param('id', ParseIntPipe) vegetableId: number, @UploadedFile() file: Express.Multer.File){
      return await this.vegetablesService.updateImage(req.user, vegetableId, file);
  }


  // TODO: Get the vegetable image
  // api allow user to upload image
  @ApiBearerAuth()
  @ApiOkResponse({
      description: 'Returns the vegetable image',
      content: {
          'application/octet-stream': {
              schema: {
                  type: 'string',
                  format: 'binary',
              },
          },
      },
  })      
  @Get(':id/image/download')
  async downloadImage(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
      return await this.vegetablesService.getImage(req.user, vegetableId);
  }







  /////////////////////////////////////////////////
  /////////////////////////////////////////////////
  // API for Price of Vegetable

  // TODO: Get the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Get price of a vegetable'})
  @Get(':id/price')
  getPrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.getPrice(req.user, vegetableId);
  }

  // TODO: Update the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Update price of a vegetable'})
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Patch(':id/price')
  updatePrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number, @Body() updateVegetablePriceDto: UpdateVegetablePriceDto){
    return this.vegetablesService.updatePrice(req.user, vegetableId, updateVegetablePriceDto);
  }

  // TODO: Delte the price
  @ApiBearerAuth()
  @ApiOperation({description: 'Delete price of a vegetable'})
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Delete(':id/price')
  deletePrice(@Request() req, @Param('id', ParseIntPipe) vegetableId: number){
    return this.vegetablesService.deletePrice(req.user, vegetableId);
  }

  
}
