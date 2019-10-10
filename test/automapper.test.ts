import { Module } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AutoMapper, MappingProfileBase } from 'automapper-nartc';
import { Expose } from 'class-transformer';
import { AutomapperModule } from '../src';
import { MAPPER_MAP } from '../src/maps/mappers.map';
import { getMapperToken } from '../src/utils/getMapperToken';

class Mock {
  @Expose()
  foo: string;
}

class MockVm {
  @Expose()
  bar: string;
}

class MockProfile extends MappingProfileBase {
  constructor() {
    super();
  }

  configure(mapper: AutoMapper): void {
    mapper
      .createMap(Mock, MockVm)
      .forMember('bar', opts => opts.mapFrom(s => s.foo));
  }
}

@Module({
  imports: [AutomapperModule.forRoot()]
})
class MockModule {}

@Module({
  imports: [AutomapperModule.forFeature({ profiles: [new MockProfile()] })]
})
class MockSubModule {}

describe('AutoMapper test', () => {
  let moduleFixture: TestingModule;
  let mapper: AutoMapper;
  let mapperMap: Map<string, AutoMapper>;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [MockModule, MockSubModule]
    }).compile();
    mapperMap = moduleFixture.get<Map<string, AutoMapper>>(MAPPER_MAP);
    mapper = moduleFixture.get<AutoMapper>(getMapperToken());
  });

  afterAll(() => {
    mapper.dispose();
  });

  it('AutomapperModule has been initialized', () => {
    expect(mapperMap.size).toBeGreaterThan(0);
    expect(mapper).toBeTruthy();
    expect(mapper).toEqual(mapperMap.get(getMapperToken()));
  });

  it('AutomapperModule - map', () => {
    const _mock = new Mock();
    _mock.foo = 'baz';

    const vm = mapper.map(_mock, MockVm);
    expect(vm).toBeTruthy();
    expect(vm.bar).toEqual(_mock.foo);
    expect(vm).toBeInstanceOf(MockVm);
  });
});
