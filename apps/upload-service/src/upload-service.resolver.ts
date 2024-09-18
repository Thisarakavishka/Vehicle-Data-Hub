import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UploadService } from "./upload-service.service";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";

@Resolver()
export class UploadServiceResolver {

    constructor(private readonly uploadService: UploadService) { }

    //health Check endpoint -  upload-service
    @Query(() => String, { name: 'uploadServiceHealthCheck' })
    uploadServiceHealthCheck(): string {
        return "Upload Service Health Check: OK";
    }

    //Upload file endpoint -  upload-service
    @Mutation(() => String)
    async uploadFile(@Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload): Promise<string> {
        return this.uploadService.handleFileUpload(file);
    }
}