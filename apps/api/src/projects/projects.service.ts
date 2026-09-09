import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        ownerId: userId,
        environments: {
          create: { name: 'staging', baseUrl: dto.stagingUrl },
        },
      },
      include: { environments: true },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.project.findMany({
      where: { ownerId: userId },
      include: { environments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { environments: true },
    });
    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== userId) {
      throw new ForbiddenException('Not your project');
    }
    return project;
  }
}
