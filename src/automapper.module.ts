import { AutoMapper } from '@nartc/automapper';
import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import {
  AutomapperModuleFeatureOptions,
  AutomapperModuleRootOptions
} from './interfaces';
import { MAPPER_MAP, MapperMap } from './maps/mappers.map';
import { getMapperToken } from './utils/getMapperToken';

@Global()
@Module({})
export class AutomapperModule {
  private static readonly logger: Logger = new Logger('AutomapperModule');

  /**
   * Initialize an AutoMapper instance with a name. Default to "default"
   *
   * Generally, `forRoot` only needs to be ran once to provide a singleton for the whole application
   *
   * @param {AutomapperModuleRootOptions} options
   */
  static forRoot(options?: AutomapperModuleRootOptions): DynamicModule {
    const mapper = new AutoMapper();

    options && options.config && mapper.initialize(options.config);

    const token = getMapperToken(options ? options.name : '');
    !MapperMap.has(token) && MapperMap.set(token, mapper);

    const providers = [
      {
        provide: token,
        useValue: mapper
      },
      {
        provide: MAPPER_MAP,
        useValue: MapperMap
      }
    ];

    return {
      module: AutomapperModule,
      providers,
      exports: providers
    };
  }

  /**
   * Add to the AutoMapper instance a list of MappingProfiles. By default, the instance with name "default" will be
   * used.
   *
   * @param {AutomapperModuleFeatureOptions} options
   */
  static forFeature(options: AutomapperModuleFeatureOptions): DynamicModule {
    if (!options || (options && !options.profiles)) {
      const message = 'AutomapperModuleFeatureOptions.profiles is empty';
      this.logger.error(message);
      throw new Error(message);
    }

    const token = getMapperToken(options ? options.name : '');

    const providers = [
      {
        provide: token,
        useFactory: (mapperMap: Map<string, AutoMapper>) => {
          if (!mapperMap.size) {
            const message =
              'AutomapperModule has not been initialized with forRoot';
            this.logger.error(message);
            throw new Error(message);
          }

          const mapper = mapperMap.get(token);

          options.profiles.forEach(mapper.addProfile.bind(mapper));
          return mapper;
        },
        inject: [MAPPER_MAP]
      }
    ];

    return {
      module: AutomapperModule,
      imports: [AutomapperModule],
      providers,
      exports: providers
    };
  }
}
