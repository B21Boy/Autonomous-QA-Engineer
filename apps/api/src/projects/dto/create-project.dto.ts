import { IsString, IsUrl, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsUrl({ require_tld: false })
  stagingUrl: string;
}
