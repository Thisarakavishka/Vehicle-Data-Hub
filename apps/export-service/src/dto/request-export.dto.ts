import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class RequestExport {

    @Field({ nullable: true })
    age?: number;

    @Field({ nullable: true })
    vehicle?: string;

    @Field({ nullable: true })
    model?: string;
}