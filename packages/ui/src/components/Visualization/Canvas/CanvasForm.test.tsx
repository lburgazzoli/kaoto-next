import * as componentCatalogMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-components.json';
import * as patternCatalogMap from '@kaoto-next/camel-catalog/camel-catalog-aggregate-patterns.json';
import * as kameletCatalogMap from '@kaoto-next/camel-catalog/kamelets-aggregate.json';
import { AutoField, AutoFields } from '@kaoto-next/uniforms-patternfly';
import { render } from '@testing-library/react';
import { JSONSchemaType } from 'ajv';
import { AutoForm } from 'uniforms';
import { IVisualizationNode, VisualComponentSchema } from '../../../models/visualization/base-visual-entity';
import { EntitiesContext } from '../../../providers/entities.provider';
import { SchemaService } from '../../Form';
import { CustomAutoFieldDetector } from '../../Form/CustomAutoField';
import { CanvasForm } from './CanvasForm';
import { CanvasNode } from './canvas.models';

describe('CanvasForm', () => {
  const omitFields = ['expression', 'dataFormatType', 'outputs', 'steps', 'when', 'otherwise', 'doCatch', 'doFinally'];
  const schemaService = new SchemaService();

  const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
    },
  } as unknown as JSONSchemaType<unknown>;

  it('should render', () => {
    const visualComponentSchema: VisualComponentSchema = {
      title: 'My Node',
      schema,
      definition: {
        name: 'my node',
      },
    };

    const selectedNode: CanvasNode = {
      id: '1',
      type: 'node',
      data: {
        vizNode: {
          getComponentSchema: () => visualComponentSchema,
        } as IVisualizationNode,
      },
    };

    const { container } = render(
      <EntitiesContext.Provider value={null}>
        <CanvasForm selectedNode={selectedNode} />
      </EntitiesContext.Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render nothing if no schema is available', () => {
    const selectedNode: CanvasNode = {
      id: '1',
      type: 'node',
      data: {
        vizNode: {
          getComponentSchema: () => undefined,
        } as IVisualizationNode,
      },
    };

    const { container } = render(
      <EntitiesContext.Provider value={null}>
        <CanvasForm selectedNode={selectedNode} />
      </EntitiesContext.Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should render nothing if no schema and no definition is available', () => {
    const visualComponentSchema: VisualComponentSchema = {
      title: 'My Node',
      schema: null as unknown as JSONSchemaType<unknown>,
      definition: null,
    };

    const selectedNode: CanvasNode = {
      id: '1',
      type: 'node',
      data: {
        vizNode: {
          getComponentSchema: () => visualComponentSchema,
        } as IVisualizationNode,
      },
    };

    const { container } = render(
      <EntitiesContext.Provider value={null}>
        <CanvasForm selectedNode={selectedNode} />
      </EntitiesContext.Provider>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should update the parameters object if null', () => {
    const visualComponentSchema: VisualComponentSchema = {
      title: 'My Node',
      schema: null as unknown as JSONSchemaType<unknown>,
      definition: {
        parameters: null,
      },
    };

    const selectedNode: CanvasNode = {
      id: '1',
      type: 'node',
      data: {
        vizNode: {
          getComponentSchema: () => visualComponentSchema,
        } as IVisualizationNode,
      },
    };

    render(
      <EntitiesContext.Provider value={null}>
        <CanvasForm selectedNode={selectedNode} />
      </EntitiesContext.Provider>,
    );

    expect(visualComponentSchema.definition.parameters).toEqual({});
  });

  it('should render for all component without an error', () => {
    Object.entries(componentCatalogMap).forEach(([name, catalog]) => {
      try {
        if (name === 'default') return;
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const schema = schemaService.getSchemaBridge((catalog as any).propertiesSchema);
        render(
          <AutoField.componentDetectorContext.Provider value={CustomAutoFieldDetector}>
            <AutoForm schema={schema!} model={{}} onChangeModel={() => {}}>
              <AutoFields omitFields={omitFields} />
            </AutoForm>
          </AutoField.componentDetectorContext.Provider>,
        );
      } catch (e) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        throw new Error(`Error rendering ${name} component: ${(e as any).message}`);
      }
    });
  });

  it('should render for all kamelets without an error', () => {
    Object.entries(kameletCatalogMap).forEach(([name, kamelet]) => {
      try {
        if (name === 'default') return;
        expect(kamelet).toBeDefined();
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const schema = (kamelet as any).propertiesSchema;
        const bridge = schemaService.getSchemaBridge(schema);
        render(
          <AutoField.componentDetectorContext.Provider value={CustomAutoFieldDetector}>
            <AutoForm schema={bridge!} model={{}} onChangeModel={() => {}}>
              <AutoFields omitFields={omitFields} />
            </AutoForm>
          </AutoField.componentDetectorContext.Provider>,
        );
      } catch (e) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        throw new Error(`Error rendering ${name} component: ${(e as any).message}`);
      }
    });
  });

  it('should render for all patterns without an error', () => {
    Object.entries(patternCatalogMap).forEach(([name, pattern]) => {
      try {
        if (name === 'default') return;
        expect(pattern).toBeDefined();
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const schema = (pattern as any).propertiesSchema;
        const bridge = schemaService.getSchemaBridge(schema);
        render(
          <AutoField.componentDetectorContext.Provider value={CustomAutoFieldDetector}>
            <AutoForm schema={bridge!} model={{}} onChangeModel={() => {}}>
              <AutoFields omitFields={omitFields} />
            </AutoForm>
          </AutoField.componentDetectorContext.Provider>,
        );
      } catch (e) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        throw new Error(`Error rendering ${name} pattern: ${(e as any).message}`);
      }
    });
  });
});
