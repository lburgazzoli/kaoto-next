import componentCatalogMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-components.json';
import dataformatsCatalogMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-dataformats.json';
import languagesCatalogMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-languages.json';
import loadbalancersMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-loadbalancers.json';
import kameletCatalogMap from '@kaoto-next/camel-catalog/kamelets-aggregate.json';
import { ICamelComponentDefinition } from '../../camel-components-catalog';
import { ICamelLanguageDefinition } from '../../camel-languages-catalog';
import { CatalogKind } from '../../catalog-kind';
import { IKameletDefinition } from '../../kamelets-catalog';
import { CamelCatalogService } from './camel-catalog.service';

describe('CamelCatalogService', () => {
  beforeEach(() => {
    CamelCatalogService.setCatalogKey(
      CatalogKind.Component,
      componentCatalogMap as unknown as Record<string, ICamelComponentDefinition>,
    );
  });

  afterEach(() => {
    CamelCatalogService.clearCatalogs();
  });

  describe('getCatalogByKey', () => {
    it('should return the catalog', () => {
      const result = CamelCatalogService.getCatalogByKey(CatalogKind.Component);

      expect(result).toEqual(componentCatalogMap);
    });
  });

  describe('getComponent', () => {
    it('should return the component', () => {
      const component = CamelCatalogService.getComponent(CatalogKind.Component, 'timer');

      expect(component?.component.name).toEqual('timer');
      expect(component).toEqual((componentCatalogMap as Record<string, unknown>).timer);
    });

    it('should return `undefined` for an `undefined` component name', () => {
      const component = CamelCatalogService.getComponent(CatalogKind.Component);

      expect(component).toBeUndefined();
    });
  });

  describe('getLanguageMap', () => {
    it('should return an empty object if there is no language map', () => {
      const map = CamelCatalogService.getLanguageMap();
      expect(map).toEqual({});
    });

    it('should return a language map', () => {
      CamelCatalogService.setCatalogKey(
        CatalogKind.Language,
        languagesCatalogMap as unknown as Record<string, ICamelLanguageDefinition>,
      );

      const map = CamelCatalogService.getLanguageMap();
      expect(map).toEqual(languagesCatalogMap);
    });
  });

  describe('getDataFormatMap', () => {
    it('should return an empty object if there is no data format map', () => {
      const map = CamelCatalogService.getDataFormatMap();
      expect(map).toEqual({});
    });

    it('should return a data format map', () => {
      CamelCatalogService.setCatalogKey(
        CatalogKind.Dataformat,
        dataformatsCatalogMap as unknown as Record<string, ICamelLanguageDefinition>,
      );

      const map = CamelCatalogService.getDataFormatMap();
      expect(map).toEqual(dataformatsCatalogMap);
    });
  });

  describe('getLoadBalancerMap', () => {
    it('should return an empty object if there is no load balancer map', () => {
      const map = CamelCatalogService.getLoadBalancerMap();
      expect(map).toEqual({});
    });

    it('should return a load balancer map', () => {
      CamelCatalogService.setCatalogKey(
        CatalogKind.Loadbalancer,
        loadbalancersMap as unknown as Record<string, ICamelLanguageDefinition>,
      );

      const map = CamelCatalogService.getLoadBalancerMap();
      expect(map).toEqual(loadbalancersMap);
    });
  });

  describe('getCatalogLookup', () => {
    it('should return `undefined` for an empty string component name', () => {
      const lookup = CamelCatalogService.getCatalogLookup('');

      expect(lookup).toBeUndefined();
    });

    it('should return a component from the catalog lookup', () => {
      const lookup = CamelCatalogService.getCatalogLookup('timer');

      expect(lookup).toEqual({
        catalogKind: CatalogKind.Component,
        definition: (componentCatalogMap as Record<string, unknown>).timer,
      });
    });

    it('should return a kamelet from the catalog lookup', () => {
      CamelCatalogService.setCatalogKey(
        CatalogKind.Kamelet,
        kameletCatalogMap as unknown as Record<string, IKameletDefinition>,
      );

      const lookup = CamelCatalogService.getCatalogLookup('kamelet:chuck-norris-source');

      expect(lookup).toEqual({
        catalogKind: CatalogKind.Kamelet,
        definition: (kameletCatalogMap as Record<string, unknown>)['chuck-norris-source'],
      });
    });
  });
});
