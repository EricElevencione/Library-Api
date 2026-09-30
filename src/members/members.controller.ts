import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateMemberDto } from './create-member.dto';
import { MembersService } from './members.service';

@Controller('members')
export class MembersController {
  constructor(private memberService: MembersService) {}

  @Get()
  getAllMembers() {
    return this.memberService.getAllMembers();
  }
  @Get(':memberId')
  getMember(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.memberService.getMember(memberId);
  }
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    // Handles POST requests to /members
    return this.memberService.createMember(createMemberDto);
  }
}
