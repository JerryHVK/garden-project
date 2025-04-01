
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  // FUNCTION TYPE 1: RETURN RESPONSE
  async findMany(){;
    const users = await this.prisma.user.findMany();
    return{
      statusCode: HttpStatus.OK,
      message: "successful",
      data: users
    }
  }

  async findOne(id: number){
    const user = await this.checkExistingUserId(id);

    if(!user){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "In valid userId"
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: "successful",
      data: user
    }
  }

  async createUser(createUserDTO: CreateUserDTO){
    const existingUser = await this.prisma.user.findUnique({where: {email: createUserDTO.email}});
    
    if(existingUser){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "This email has been already signed up"
      }
    }

    await this.prisma.user.create({data: createUserDTO})

    return {
      statusCode: HttpStatus.CREATED,
      message: "Created user succesfully"
    }
  }

  async deleteUser(id: number){
    const user = await this.checkExistingUserId(id);

    if(!user){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "In valid userId"
      }
    }

    await this.prisma.user.delete({where: {id}});
    return{
      statusCode: HttpStatus.NO_CONTENT,
      message: "Deleted user successfully"
    }
  }


  async updateUserBasicInfo(id: number, updateUserDTO: UpdateUserDTO){
    const user = await this.checkExistingUserId(id);

    if(!user){
      return{
        statusCode: HttpStatus.BAD_REQUEST,
        message: "In valid userId"
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: {id},
      data: updateUserDTO
    })

    return{
      statusCode: HttpStatus.OK,
      message: "Updated user successfully",
      data: updatedUser
    }
  }






  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////
  // FUNCTION TYPE 2: SECONDARY FUNCTIONS

  async checkExistingUserId(id: number){
    return await this.prisma.user.findUnique({where: {id}});
  }

  async checkExistingUserEmail(email: string){
    return await this.prisma.user.findUnique({where: {email}});
  }
}
