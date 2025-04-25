import { Controller, Post, Body, Request, ParseIntPipe, Param, Query, Get, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SaveTransactionDto } from './dto/save-transaction.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/common/role.enum';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService){}

  // @Public()
  // @ApiBearerAuth()
  // @ApiOperation({description: "Add new transaction / buy some vegetables"})
  // @Post()
  // create(@Body() saveTransactionDto: SaveTransactionDto){
  //   return this.salesService.create(saveTransactionDto);
  // }

  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // API - FOR ADMIN ONLY


  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({description: "Get the total sale of each user"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Get('/users')
  getSalesOfUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.salesService.getSalesOfUsers(page, limit, sortBy, sortOrder)
  }

  // @ApiBearerAuth()
  // @UseGuards(RolesGuard)
  // @Roles(Role.Admin)
  // @ApiOperation({description: "Get the total sale of each user"})
  // @Get('/users')
  // getTotalSalesOfUsers(){
  //   return this.salesService.getSalesOfUsers()
  // }



  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @ApiOperation({description: "Get the total sale of each garden of an user"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Get('/users/:id')
  getSalesOfOneUser(
    @Param('id', ParseIntPipe) userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortBy') sortBy: string = 'name',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'asc',
  ){
    page = +page;
    limit = +limit;
    limit = limit <= 100 ? limit : 5
    return this.salesService.getSalesOfOneUser(userId, page, limit, sortBy, sortOrder);
  }


  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // API - FOR USER ONLY

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @ApiOperation({description: "Get the total sale of each garden belong to user"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Get('/gardens')
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
    return this.salesService.getSalesOfOneUser(req.user.id, page, limit, sortBy, sortOrder)
  }

  ///////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////
  // API - FOR BOTH ADMIN & USER

  @ApiBearerAuth()
  @ApiOperation({description: "Get the total sale of each kind of vegetable in a garden"})
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page'})
  @ApiQuery({ name: 'sortBy', required: false, type: String, description: 'Sort by field' })
  @ApiQuery({ name: 'sortOrder', required: false, type: String, enum: ['asc', 'desc'], description: 'Sort order' })
  @Get('/gardens/:id')
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
