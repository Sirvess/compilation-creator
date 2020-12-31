import * as React from "react";
import styled from "styled-components";
import { useForm, useFieldArray } from "react-hook-form";

const StartButton = styled.button`
  font-size: 32px;
  padding: 0.35em 1.2em;
  border: 0.1em solid black;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  text-decoration: none;
  background-color: #f98a5e;
  color: black;
  font-weight: 300;
  text-align: center;
  transition: all 0.2s;
  :hover {
    cursor: pointer;
    background-color: #ffffff;
  }
`;

const Container = styled.div`
  padding-top: 100px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 600px;
`;

const FormInput = styled.input`
  margin: 10px;
`;

export const Form: React.ComponentType<{
  setPlaylist: (x: Video[]) => void;
}> = ({ setPlaylist }) => {
  // Use useFieldArray instead
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      videos: [
        ["uvvqjyT0_gA", 98, 113],
        ["QESBcjX-G9g", 105, 115],
        ["yC8SPG2LwSA", 15, 20],
      ],
      videoStartSeconds: [1, 2],
      videoEndSeconds: [0, 3],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "videos" });
  const onSubmit = (data) => {
    console.log("derp data", data["data"]);
    const playlist = data["data"].map((item) => {
      console.log("item", item);
      const id = item["video"];
      const starts = item["startSeconds"];
      const ends = item["endSeconds"];
      return { id, startSeconds: Number(starts), endSeconds: Number(ends) };
    });
    setPlaylist(playlist);
  };
  console.log("derp fields", fields);
  return (
    <Container>
      Video Id, Start Seconds, End Seconds
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          {fields.map((field, i) => (
            <span key={field.id}>
              <FormInput
                name={`data[${i}].video`}
                ref={register()}
                defaultValue={field[0]}
              />
              <FormInput
                name={`data[${i}].startSeconds`}
                ref={register()}
                defaultValue={field[1]}
              />
              <FormInput
                name={`data[${i}].endSeconds`}
                ref={register()}
                defaultValue={field[2]}
              />
            </span>
          ))}
          <button
            onClick={(e) => {
              e.preventDefault();
              append({ 0: "", 1: "", 2: "" });
            }}
          >
            Add
          </button>
          <StartButton>Play </StartButton>
        </FormContainer>
      </form>
    </Container>
  );
};
