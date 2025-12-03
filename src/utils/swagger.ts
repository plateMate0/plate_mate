import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { OpenApiNestFactory } from 'nest-openapi-tools';

export async function swagger(app: INestApplication) {
  await OpenApiNestFactory.configure(
    app,
    new DocumentBuilder()
      .setTitle('Competition')
      .setDescription('An API to manage competitions')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
        description: 'Enter your Bearer token',
      })
      .addSecurityRequirements('bearer'),
    {
      webServerOptions: {
        enabled: true,
        path: 'swagger',
      },
      fileGeneratorOptions: {
        enabled: true,
        outputFilePath: './swagger.json',
      },
      clientGeneratorOptions: {
        enabled: false,
        type: 'typescript-axios',
        outputFolderPath: '../client/src/ts-axios',
        additionalProperties:
          'apiPackage=clients,modelPackage=models,withoutPrefixEnums=false,withSeparateModelsAndApi=true',
        openApiFilePath: './swagger.json',
        skipValidation: true,
      },
    },
    {
      operationIdFactory: (c: string, method: string) => method,
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Template')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your Bearer token',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
