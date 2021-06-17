describe("Star Trek game", function () {
  it("Not enough Torpedos", function () {
    let game = new Game();
    game.t = 0;
    spyOn(game, "say");

    game.processCommand(new UserInterface("photon"));

    expect(game.say).toHaveBeenCalledWith(
      "<p>" + "No more photon torpedoes!" + "</p>"
    );
  });
});
