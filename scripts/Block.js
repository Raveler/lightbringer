define(["Compose", "Entity", "GroundDrawable", "BoxFixture", "Data"], function(Compose, Entity, GroundDrawable, BoxFixture, Data) {

	var Block = Compose(Entity, function(data) {

		// health is determined by size
		data.health = data.size.x * data.size.y;

		// add the ground drawable
		this.addDrawable(new GroundDrawable({
			loc: new Vector2(0, 0),
			size: data.size,
			halfWidth: 0.2
		}));

		// add fixture
		this.addFixture(new BoxFixture({
			loc: new Vector2(data.size.x*Data.blockSize/2, data.size.y*Data.blockSize/2),
			width: data.size.x*Data.blockSize,
			height: data.size.y*Data.blockSize
		}));
	},
	{
	});

	return Block;
});