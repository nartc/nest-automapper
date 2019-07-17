import { Inject } from '@nestjs/common';
import { AUTOMAPPER } from '../automapper.module';

export const InjectMapper = () => Inject(AUTOMAPPER);
