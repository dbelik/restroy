import { IsString, Length } from 'class-validator';

export default class IdInputDto {
  @IsString()
  @Length(1, 255)
    id: string;
}
