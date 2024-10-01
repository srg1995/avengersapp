import React, { useContext, useEffect, useMemo } from "react";
import { CharactersContext } from "../../common/context/CharactersContextProvider";
import { MiniHeartRedIcon, MiniHeartWhiteIcon } from "../../assets/icons";
import { fetchCharacters } from "../../services/charactersService";
import { charactersAdapter } from "../../services/adapters/charactersAdapter";


const characterResource = fetchCharacters();

export default function CardsInfo() {
  const { charactersData, setCharactersData, navigate, isShowLiked } =
    useContext(CharactersContext);

  // Obtener los datos de personajes desde el recurso
  const data = characterResource.read();
  const adaptedData = useMemo(() => charactersAdapter(data), [data]);

  setCharactersData((prevState) => {
    // Solo actualizar si los datos han cambiado
    if (
      JSON.stringify(prevState?.characters) !==
      JSON.stringify(adaptedData?.characters)
    ) {
      return adaptedData;
    }
    return prevState; // Retorna el estado anterior si no hay cambios
  });

  const handleButton = (e, result) => {
    if (result?.isLiked) {
      charactersData.activeCounter--;
    } else {
      charactersData.activeCounter++;
    }
    e.stopPropagation();
    setCharactersData((prevState) => ({
      ...prevState,
      characters: prevState?.characters.map((chara) =>
        chara.id === result?.id ? { ...chara, isLiked: !chara?.isLiked } : chara
      ),
    }));
  };
  return (
    <div className="cards">
      {charactersData &&
        charactersData?.characters?.map((result) => {
          const characterImage = result?.image;
          const characterName = result?.name;
          const characterId = result?.id;
          return (
            <div
              className={`card ${
                !result.isLiked && isShowLiked ? "hiddenCard" : ""
              }`}
              key={characterId}
              onClick={() => {
                navigate(`/characterDetailPage/${characterId}`);
              }}
            >
              <img alt={characterName} src={characterImage}></img>
              <div className="divider"></div>
              <div className="name">
                {characterName}
                <button
                  className="heart"
                  onClick={(e) => handleButton(e, result)}
                >
                  {result.isLiked ? (
                    <MiniHeartRedIcon />
                  ) : (
                    <MiniHeartWhiteIcon />
                  )}
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
}
