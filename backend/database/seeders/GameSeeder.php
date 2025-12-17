<?php

namespace Database\Seeders;

use App\Models\Game;
use Illuminate\Database\Seeder;

class GameSeeder extends Seeder
{
    public function run()
    {
        $games = [

            [
                'title' => 'Cyberpunk 2077',
                'description' => 'Open-world RPG set in Night City.',
                'price' => 59.99,
                'discount' => 20,
                'rating' => 4,
                'category' => 'RPG',
                'platform' => 'PC',
                'developer' => 'CD Projekt Red',
                'publisher' => 'CD Projekt',
                'release_date' => '2020-12-10',
                'image_url' => 'https://i.pinimg.com/736x/f4/52/d6/f452d6aecee97aac699242c7dc6cc046.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Cyberpunk', 'Open World']),
                'age_rating' => 18,
                'is_featured' => true,
                'is_trending' => true
            ],

            [
                'title' => 'Elden Ring',
                'description' => 'A vast fantasy action RPG.',
                'price' => 59.99,
                'discount' => 15,
                'rating' => 5,
                'category' => 'Action RPG',
                'platform' => 'Multi',
                'developer' => 'FromSoftware',
                'publisher' => 'Bandai Namco',
                'release_date' => '2022-02-25',
                'image_url' => 'https://i.pinimg.com/1200x/90/5b/e1/905be11689eaccaf15ce087cbfe51ca6.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Soulslike', 'Fantasy']),
                'age_rating' => 16,
                'is_featured' => true,
                'is_trending' => true
            ],

            [
                'title' => 'Red Dead Redemption 2',
                'description' => 'Epic western open-world adventure.',
                'price' => 59.99,
                'discount' => 30,
                'rating' => 5,
                'category' => 'Adventure',
                'platform' => 'PC',
                'developer' => 'Rockstar Games',
                'publisher' => 'Rockstar Games',
                'release_date' => '2019-11-05',
                'image_url' => 'https://i.pinimg.com/736x/d1/13/9b/d1139b1ee12965f315652a3eb970aa28.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Open World', 'Story']),
                'age_rating' => 18,
                'is_featured' => true,
                'is_trending' => true
            ],

            [
                'title' => 'GTA V',
                'description' => 'Action-packed crime sandbox.',
                'price' => 29.99,
                'discount' => 50,
                'rating' => 5,
                'category' => 'Action',
                'platform' => 'PC',
                'developer' => 'Rockstar North',
                'publisher' => 'Rockstar Games',
                'release_date' => '2015-04-14',
                'image_url' => 'https://i.pinimg.com/1200x/d2/55/ac/d255ac78bb40edc96076bb4c22a32504.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Crime', 'Multiplayer']),
                'age_rating' => 18,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'God of War',
                'description' => 'Kratos journey through Norse mythology.',
                'price' => 49.99,
                'discount' => 25,
                'rating' => 5,
                'category' => 'Action',
                'platform' => 'PC',
                'developer' => 'Santa Monica Studio',
                'publisher' => 'Sony',
                'release_date' => '2022-01-14',
                'image_url' => 'https://i.pinimg.com/1200x/73/76/16/7376161d93cba6f27a286d593bbc3e5a.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Mythology', 'Story']),
                'age_rating' => 18,
                'is_featured' => true,
                'is_trending' => false
            ],

            [
                'title' => 'Hogwarts Legacy',
                'description' => 'Magical open-world RPG in Hogwarts.',
                'price' => 59.99,
                'discount' => 10,
                'rating' => 4,
                'category' => 'RPG',
                'platform' => 'PC',
                'developer' => 'Avalanche',
                'publisher' => 'Warner Bros',
                'release_date' => '2023-02-10',
                'image_url' => 'https://i.pinimg.com/736x/0a/8a/56/0a8a560e792d749decfc1c6ba6accae0.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Magic', 'Fantasy']),
                'age_rating' => 16,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'The Witcher 3',
                'description' => 'Story-driven open world RPG.',
                'price' => 39.99,
                'discount' => 60,
                'rating' => 5,
                'category' => 'RPG',
                'platform' => 'PC',
                'developer' => 'CD Projekt Red',
                'publisher' => 'CD Projekt',
                'release_date' => '2015-05-19',
                'image_url' => 'https://i.pinimg.com/736x/dc/0e/d4/dc0ed4707450cc789a664caa9526d8dc.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Fantasy', 'Story']),
                'age_rating' => 18,
                'is_featured' => true,
                'is_trending' => false
            ],

            [
                'title' => 'Assassin’s Creed Valhalla',
                'description' => 'Viking-themed open world action.',
                'price' => 59.99,
                'discount' => 40,
                'rating' => 4,
                'category' => 'Action',
                'platform' => 'PC',
                'developer' => 'Ubisoft',
                'publisher' => 'Ubisoft',
                'release_date' => '2020-11-10',
                'image_url' => 'https://i.pinimg.com/1200x/5a/35/90/5a35909716eef029a4cbacde85ae2eda.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Viking', 'Open World']),
                'age_rating' => 18,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'Resident Evil 4 Remake',
                'description' => 'Survival horror reimagined.',
                'price' => 59.99,
                'discount' => 20,
                'rating' => 5,
                'category' => 'Horror',
                'platform' => 'PC',
                'developer' => 'Capcom',
                'publisher' => 'Capcom',
                'release_date' => '2023-03-24',
                'image_url' => 'https://i.pinimg.com/1200x/cd/85/6c/cd856ce613dcc3f85e837952776b6740.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Horror', 'Survival']),
                'age_rating' => 18,
                'is_featured' => true,
                'is_trending' => true
            ],

            [
                'title' => 'Call of Duty: MW III',
                'description' => 'Fast-paced military FPS.',
                'price' => 69.99,
                'discount' => 10,
                'rating' => 4,
                'category' => 'FPS',
                'platform' => 'PC',
                'developer' => 'Infinity Ward',
                'publisher' => 'Activision',
                'release_date' => '2023-11-10',
                'image_url' => 'https://i.pinimg.com/1200x/de/a2/ad/dea2ad674101169d702fc462556be805.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['FPS', 'Multiplayer']),
                'age_rating' => 18,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'Forza Horizon 5',
                'description' => 'Open-world racing in Mexico.',
                'price' => 59.99,
                'discount' => 35,
                'rating' => 5,
                'category' => 'Racing',
                'platform' => 'PC',
                'developer' => 'Playground Games',
                'publisher' => 'Xbox',
                'release_date' => '2021-11-09',
                'image_url' => 'https://i.pinimg.com/736x/a4/dc/ad/a4dcad468aad76c90915b758b70327ae.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Racing', 'Open World']),
                'age_rating' => 3,
                'is_featured' => true,
                'is_trending' => false
            ],

            [
                'title' => 'Minecraft',
                'description' => 'Sandbox survival creativity.',
                'price' => 26.95,
                'discount' => 0,
                'rating' => 5,
                'category' => 'Sandbox',
                'platform' => 'Multi',
                'developer' => 'Mojang',
                'publisher' => 'Microsoft',
                'release_date' => '2011-11-18',
                'image_url' => 'https://i.pinimg.com/736x/5f/f0/e9/5ff0e997a4a8ba449056ed679660f4cc.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Sandbox', 'Survival']),
                'age_rating' => 7,
                'is_featured' => true,
                'is_trending' => true
            ],

            [
                'title' => 'Valorant',
                'description' => 'Competitive tactical shooter.',
                'price' => 0,
                'discount' => 0,
                'rating' => 4,
                'category' => 'FPS',
                'platform' => 'PC',
                'developer' => 'Riot Games',
                'publisher' => 'Riot Games',
                'release_date' => '2020-06-02',
                'image_url' => 'https://i.pinimg.com/736x/7b/f6/1b/7bf61b8b77e394c4bc709f6b02c0db24.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Esports', 'Shooter']),
                'age_rating' => 16,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'Dota 2',
                'description' => 'Competitive MOBA strategy game.',
                'price' => 0,
                'discount' => 0,
                'rating' => 5,
                'category' => 'MOBA',
                'platform' => 'PC',
                'developer' => 'Valve',
                'publisher' => 'Valve',
                'release_date' => '2013-07-09',
                'image_url' => 'https://i.pinimg.com/1200x/09/1d/37/091d371866ebbc9b858ac76fe6d1c2f7.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['MOBA', 'Esports']),
                'age_rating' => 13,
                'is_featured' => false,
                'is_trending' => true
            ],

            [
                'title' => 'Stardew Valley',
                'description' => 'Relaxing farming simulation.',
                'price' => 14.99,
                'discount' => 50,
                'rating' => 5,
                'category' => 'Simulation',
                'platform' => 'PC',
                'developer' => 'ConcernedApe',
                'publisher' => 'ConcernedApe',
                'release_date' => '2016-02-26',
                'image_url' => 'https://i.pinimg.com/1200x/87/c5/4e/87c54e9c046b77138e5faf6bb373acad.jpg',
                'screenshots' => json_encode([]),
                'tags' => json_encode(['Farming', 'Relaxing']),
                'age_rating' => 7,
                'is_featured' => true,
                'is_trending' => false
            ],

        ];

        foreach ($games as $game) {
            Game::create($game);
        }
    }
}
