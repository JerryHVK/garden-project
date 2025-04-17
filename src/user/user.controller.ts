import { Controller, Get, Param, Post, Body, Delete, ParseIntPipe, UseGuards, Patch, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Role } from 'src/common/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    // API - FOR ADMIN ONLY

    // find all user: 
    // Route - GET: /user
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Get()
    async findMany(){
        return await this.userService.findMany();
    }
    
    // find one user by id: 
    // Route - GET: /user/id
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Get('/:id')
    async findOne(@Param('id', ParseIntPipe) id: number){
        return await this.userService.findOne(id);
    }

    // create user
    // Route - POST: /user
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Post()
    async create(@Body() createUserDTO: CreateUserDTO){
        return await this.userService.createUser(createUserDTO);
    }

    // delete user
    // Route - DELETE: /user/id
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.deleteUser(id);
    }

    // TODO: lock user
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Get(':id/lock')
    async lockUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.lockUser(id);
    }

    // TODO: unlock user
    @ApiBearerAuth()
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Get(':id/unlock')
    async unlockUser(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.unlockUser(id);
    }




    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    // API - FOR BOTH USER AND ADMIN

    // get user profile: GET /user/profile
    @ApiBearerAuth()
    @Get('/profile')
    async getUserProfile(@Request() req) {
        return await this.userService.findOne(req.user.id);
    }

    // update basic info: PATCH: /user
    @ApiBearerAuth()
    @Patch()
    async updateUserBasicInfo(@Request() req, updateUserDTO: UpdateUserDTO) {
        return await this.userService.updateUserBasicInfo(req.user.id, updateUserDTO);
    }



    // api allow user to upload image
    @ApiBearerAuth()
    @Post('/image/upload')
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
            destination: 'src/files/images/profiles',
            filename: (req, file, callback) => {
                const filename = `profile-${Date.now()}${extname(file.originalname)}`;
                callback(null, filename);
            }
        })
        }
    ))
    async uploadImage(@Request() req, @UploadedFile() file: Express.Multer.File){
        return await this.userService.updateAvatar(req.user, file);
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Returns the user avatar image',
        content: {
            'application/octet-stream': {
                schema: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })      
    @Get('image/download')
    async downloadImage(@Request() req){
        return await this.userService.getAvatar(req.user);
    }
}
