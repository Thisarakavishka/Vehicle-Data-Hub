import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class ResponseExport {

    @Field()
    message: string;

    @Field({ nullable: true })
    path?: string;
}