import * as React from "react";
import styled from "styled-components";
import { useForm, useFieldArray } from "react-hook-form";

const FORM_WIDTH = `900px`;

const Button = styled.button`
  margin: 10px 0.3em 0.3em 10px;
  font-size: 20px;
  border: 0.1em solid black;
  margin: 0 0.3em 0.3em 0;
  border-radius: 0.12em;
  padding: 0.35em 1.2em;
  text-decoration: none;
  background-color: #884d8c;
  font-weight: 300;
  text-align: center;
  transition: all 0.2s;
  color: white;
  :hover {
    cursor: pointer;
    background-color: #ffffff;
    color: black;
  }
`;

const StartButton = styled(Button)`
  font-size: 32px;
  background-color: #f98a5e;
  color: black;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const Container = styled(FlexContainer)`
  padding-top: 100px;
  background-color: white;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const FormContainer = styled(FlexContainer)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: ${FORM_WIDTH};
`;

const FormInput = styled.input`
  padding: 0.2em;
  padding-left: 0;
  width: calc(100% / 3);
  margin: 10px 10px 10px 0px;
  font-size: 20px;
`;
const ButtonContainer = styled(FlexContainer)`
  justify-content: center;
  align-items: center;
`;

const InputSpan = styled.span`
  min-width: ${FORM_WIDTH};
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  margin-bottom: 10px;
`;

const Label = styled.p`
  font-size: 20px;
  padding: 0.2em 0.2em 0.2em 0;
  text-align: left;
  width: calc(100% / 3);
`;
const onSubmit = (setPlaylist: (x: Playlist) => void) => (data: {
  data: Video[];
}) => {
  const playlist: Playlist = data["data"]
    .filter((item) => item?.id?.length && item.id.length > 0)
    .map(({ id, startSeconds, endSeconds }: Video) => {
      const starts = startSeconds;
      const ends = endSeconds;
      return { id, startSeconds: Number(starts), endSeconds: Number(ends) };
    });
  setPlaylist(playlist.reverse());
};

// Used as initial value for form
// Array index corresponds to index of property in Video-type
const FallbackVideos = [
  ["1wnE4vF9CQ4", 100, 110],
  ["QESBcjX-G9g", 105, 110],
  ["I6IBTNG8DWk", 210, 245],
];

// May load compilation from URL
// e.g. http://localhost:10001/?id=uvvqjyT0_gA,10,20&id=QESBcjX-G9g,10,20
const useSearchParams = (): Playlist | undefined => {
  const searchParams = new URL(document.location.href).searchParams;
  const videos = searchParams.getAll("id");
  const playlist = videos.map(
    (s): Video => {
      const splitstr = s.split(",");
      const id = splitstr[0];
      const startSeconds = Number(splitstr[1]);
      const endSeconds = Number(splitstr[2]);
      return { id, startSeconds, endSeconds };
    }
  );
  return playlist.length > 0 ? playlist : undefined;
};

const playlist2Form = (playlist: Playlist): typeof FallbackVideos => {
  return playlist.map(({ id, startSeconds, endSeconds }) => [
    id,
    startSeconds ?? 0, // TODO: Fallback
    endSeconds ?? 0, // TODO: Fallback
  ]);
};

export const Form: React.ComponentType<{
  setPlaylist: (x: Video[]) => void;
}> = ({ setPlaylist }) => {
  const videos = useSearchParams();
  const { control, register, getValues } = useForm({
    defaultValues: {
      videos: videos ? playlist2Form(videos) : FallbackVideos,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "videos",
  });
  return (
    <Container>
      <InputSpan>
        <Label>
          <b>Video Id</b>
        </Label>
        <Label>
          <b>Start Seconds</b>
        </Label>
        <Label>
          <b>End Seconds</b>
        </Label>
      </InputSpan>
      <form
        onSubmit={() => {
          //@ts-ignore
          onSubmit(setPlaylist)(getValues());
        }}
      >
        <FormContainer>
          {fields.map((field, i) => (
            <InputSpan key={field.id}>
              <FormInput
                name={`data[${i}].id`}
                ref={register()}
                defaultValue={field[0]}
                required={true}
                key={field.id}
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
            </InputSpan>
          ))}
          <ButtonContainer>
            <Button
              onClick={(e) => {
                e.preventDefault();
                append({ 0: "qarhFjIRxNg", 1: 30, 2: 50 });
              }}
            >
              Add Video
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                remove(fields.length - 1);
              }}
            >
              Remove Last
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                const vals = getValues();
                //@ts-ignore
                const playlist: Playlist = vals["data"]
                  //@ts-ignore
                  .filter((item) => item?.id?.length && item.id.length > 0)
                  .map(({ id, startSeconds, endSeconds }: Video) => {
                    return [
                      id,
                      Number(startSeconds),
                      Number(endSeconds),
                    ].join();
                  })
                  .join("&id=");

                window.history.pushState(
                  null,
                  "",
                  `${location.pathname}?id=${playlist}`
                );
              }}
            >
              Push to URL
            </Button>
          </ButtonContainer>
          <StartButton>Play</StartButton>
        </FormContainer>
      </form>
    </Container>
  );
};
