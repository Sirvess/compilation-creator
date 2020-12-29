import * as React from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

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

const placeholderPlaylist = [
  { id: "uvvqjyT0_gA", startSeconds: 98, endSeconds: 113 },
  { id: "QESBcjX-G9g", startSeconds: 105, endSeconds: 115 },
  { id: "yC8SPG2LwSA", startSeconds: 15, endSeconds: 20 },
];
const PLAYLIST_ITEMS = 3;
// TODO: Implement form to allow starting custom playlist
export const Form: React.ComponentType<{
  setPlaylist: (x: Video[]) => void;
}> = ({ setPlaylist }) => {
  const { register, handleSubmit } = useForm();
  const playlistItems = Array.from(Array(PLAYLIST_ITEMS).keys());
  const onSubmit = (data) => {
    const items = Object.keys(data).filter((key) => !isNaN(Number(key)));
    const playlist = items.map((key) => {
      const id = data[key];
      const starts = data[key + "s"];
      const ends = data[key + "e"];
      return { id, startSeconds: Number(starts), endSeconds: Number(ends) };
    });
    setPlaylist(playlist);
  };
  return (
    <Container>
      Video Id, Start Seconds, End Seconds
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormContainer>
          {...playlistItems.map((i) => (
            <span key={i + "d"}>
              <FormInput
                name={i.toString()}
                defaultValue={placeholderPlaylist[i]["id"]}
                ref={register}
                key={i}
              />
              <FormInput
                name={i.toString() + "s"}
                defaultValue={placeholderPlaylist[i]["startSeconds"]}
                ref={register}
                key={i + "s"}
              />
              <FormInput
                name={i.toString() + "e"}
                defaultValue={placeholderPlaylist[i]["endSeconds"]}
                ref={register}
                key={i + "e"}
              />
            </span>
          ))}
          <StartButton>Play </StartButton>
        </FormContainer>
      </form>
    </Container>
  );
};
